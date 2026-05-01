import { Interview } from "../models/interview.model";
import { AppError } from "../utils/AppError.utils";
import { getGeminiModel } from "../config/gemini.config";

interface GeminiResponse {
    evaluation_of_previous_answer: string;
    next_question: string;
    is_complete: boolean;
}

const formatHistory = (qaPairs: any[]): string => {
    return qaPairs
        .map(
            (qa, index) =>
                `Q${index + 1}: ${qa.question}\nCandidate A: ${qa.candidate_answer || "[No answer yet]"}`,
        )
        .join("\n\n");
};

const buildPrompt = (
    jobRole: string,
    roundType: string,
    questionNumber: number,
    maxQuestions: number,
    history: string,
    candidateAnswer?: string,
): string => {
    const isFirst = !candidateAnswer;

    return `You are a Technical Interviewer for a ${jobRole} position.
            This is a ${roundType} round. We are on question ${questionNumber} of ${maxQuestions}.

            ${
                isFirst
                    ? "Start the interview by generating the first question."
                    : `CONVERSATION SO FAR:\n${history}\n\nEvaluate the candidate's last answer, then ask the next question.`
            }

            Rules:
            1. Keep the 'next_question' concise and to the point.
            2. Progressively increase difficulty based on their previous answers.
            3. If this is question ${maxQuestions}, set is_complete to true and leave 'next_question' empty.

            Respond strictly in this JSON format:
            {
                "evaluation_of_previous_answer": "Brief assessment of their answer (leave empty if this is the first question)",
                "next_question": "The next question to ask",
                "is_complete": false
            }`;
};

export const startRoundService = async (
    interviewId: string,
    roundIndex: number,
    userId: string,
) => {
    const interview: any =
        await Interview.findById(interviewId).populate("job_id");
    if (!interview) throw new AppError("Interview Not found", 404);
    if (interview.user_id.toString() !== userId)
        throw new AppError("Access Denied", 401);

    const round = interview.rounds[roundIndex];
    if (round.status === "completed")
        throw new AppError("Round already completed", 400);

    // If round already has QA pairs, just return it
    if (round.qa_pairs.length > 0) return { interview, round, roundIndex };

    // Generating first question
    const prompt = buildPrompt(
        interview.job_id.role,
        round.type,
        1,
        round.max_questions,
        "",
    );
    const model = getGeminiModel(true);
    const result = await model.generateContent(prompt);
    const aiData: GeminiResponse = JSON.parse(result.response.text());

    // Push the VERY FIRST question into the array
    interview.rounds[roundIndex].qa_pairs.push({
        question: aiData.next_question,
        timestamp: new Date(),
    });

    interview.rounds[roundIndex].status = "ongoing";
    interview.status = "ongoing";
    await interview.save();

    return { interview, round: interview.rounds[roundIndex], roundIndex };
};

export const answerInRoundService = async (
    interviewId: string,
    roundIndex: number,
    candidateAnswer: string,
    userId: string,
) => {
    const interview: any =
        await Interview.findById(interviewId).populate("job_id");
    if (!interview) throw new AppError("Interview Not found", 404);
    if (interview.user_id.toString() !== userId)
        throw new AppError("Access Denied", 401);

    const current_round = interview.rounds[roundIndex];

    if (current_round.status !== "ongoing")
        throw new AppError("Round is not active", 400);

    // 1. Find the current active question (the last one in the array)
    const currentQuestionIndex = current_round.qa_pairs.length - 1;
    if (currentQuestionIndex < 0)
        throw new AppError("No active question found", 400);

    // 2. Save candidate's answer into the existing QA pair
    current_round.qa_pairs[currentQuestionIndex].candidate_answer =
        candidateAnswer;

    // 3. Prepare AI request
    const maxQuestions = current_round.max_questions;
    const history = formatHistory(current_round.qa_pairs);
    const prompt = buildPrompt(
        interview.job_id.role,
        current_round.type,
        currentQuestionIndex + 2,
        maxQuestions,
        history,
        candidateAnswer,
    );

    const model = getGeminiModel(true);
    const result = await model.generateContent(prompt);
    const aiData: GeminiResponse = JSON.parse(result.response.text());

    current_round.qa_pairs[currentQuestionIndex].ai_evaluation =
        aiData.evaluation_of_previous_answer;

    // Checking if we are done or if we need to push a new question
    if (aiData.is_complete || current_round.qa_pairs.length >= maxQuestions) {
        return await _finalizeRound(interview, roundIndex);
    } else {
        // Adding new question
        current_round.qa_pairs.push({
            question: aiData.next_question,
            timestamp: new Date(),
        });
    }

    // Tell Mongoose exactly what changed since we modified a deeply nested array index
    interview.markModified(`rounds.${roundIndex}.qa_pairs`);
    await interview.save();

    return { interview, round: current_round, roundIndex };
};

export const getRoundService = async (
    interviewId: string,
    roundIndex: number,
    userId: string,
) => {
    const interview = await Interview.findById(interviewId);
    if (!interview) throw new AppError("Interview Not found", 404);
    if (interview.user_id.toString() !== userId)
        throw new AppError("Access Denied", 401);

    const round = interview.rounds[roundIndex];
    if (!round) throw new AppError("Round not found", 404);

    return { interview, round, roundIndex };
};

const _finalizeRound = async (interview: any, roundIndex: number) => {
    const round = interview.rounds[roundIndex];
    const model = getGeminiModel(true);
    const transcript = formatHistory(round.qa_pairs);

    const summaryPrompt = `Review this technical interview round:\n${transcript}\n\nProvide JSON: {"summary": "2 sentences", "final_score": 85} Ensure final_score is out of 100.`;

    let summary = "Round completed.";
    let finalScore = 50;

    try {
        const result = await model.generateContent(summaryPrompt);
        const data = JSON.parse(result.response.text());
        summary = data.summary;
        finalScore = data.final_score;
    } catch {
        console.error("Failed to generate round summary, using fallbacks.");
    }

    interview.rounds[roundIndex].status = "completed";
    interview.rounds[roundIndex].score = finalScore;
    interview.rounds[roundIndex].remarks = summary;

    const allDone = interview.rounds.every(
        (r: any) => r.status === "completed" || r.status === "failed",
    );

    if (allDone) {
        const completedRounds = interview.rounds.filter(
            (r: any) => r.status === "completed",
        );
        const avgScore =
            completedRounds.length > 0
                ? Math.round(
                      completedRounds.reduce(
                          (sum: number, r: any) => sum + (r.score || 0),
                          0,
                      ) / completedRounds.length,
                  )
                : 0;

        interview.score = avgScore;
        interview.status = "completed";

        interview.remarks = `Interview completed. Average score: ${avgScore}/100.`;
    }

    await interview.save();
    return { interview, round: interview.rounds[roundIndex], roundIndex };
};
