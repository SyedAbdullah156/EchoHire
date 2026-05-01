import { Interview } from "../models/interview.model";
import { AppError } from "../utils/AppError.utils";
import { getGeminiModel } from "../config/gemini.config";

interface GeminiResponse {
    spoken_response: string;
    score_update: number;
    next_topic: string;
    is_complete: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatHistory = (messages: any[]): string => {
    return messages
        .map(
            (m) =>
                `${m.role === "ai" ? "Interviewer" : "Candidate"}: ${m.content}`,
        )
        .join("\n");
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
            This is a ${roundType} round. This is question ${questionNumber} of ${maxQuestions}.

            ${isFirst ? "Start the interview with your first question." : `CONVERSATION SO FAR:\n${history}\n\nCandidate answered: "${candidateAnswer}"\n\nEvaluate their answer briefly and ask the next question.`}

            Rules:
            1. Ask exactly ONE question.
            2. Progressively increase difficulty based on their answers.
            3. If this is question ${maxQuestions}, set is_complete to true.

            Respond strictly in this JSON format:
            {
                "spoken_response": "Your evaluation and next question",
                "score_update": 5,
                "next_topic": "concept being tested",
                "is_complete": false
            }`;
};

// ─── Services ─────────────────────────────────────────────────────────────────

export const startRoundService = async (
    interviewId: string,
    roundIndex: number,
    userId: string,
) => {
    const interview: any =
        await Interview.findById(interviewId).populate("job_id");

    if (!interview) throw new AppError("Interview not found", 404);
    if (interview.user_id.toString() !== userId)
        throw new AppError("Access denied", 403);

    const round = interview.rounds[roundIndex];
    if (!round) throw new AppError(`Round ${roundIndex} not found`, 404);
    if (round.status === "completed")
        throw new AppError("Round already completed", 400);

    // If already started, return current state
    if (round.messages.length > 0) return { interview, round, roundIndex };

    const job = interview.job_id;
    const model = getGeminiModel(true); // Enforce Native JSON Mode

    const prompt = buildPrompt(
        job.role,
        round.type,
        1,
        interview.questions_per_round,
        "",
    );
    const result = await model.generateContent(prompt);
    const aiData: GeminiResponse = JSON.parse(result.response.text());

    interview.rounds[roundIndex].messages.push({
        role: "ai",
        content: aiData.spoken_response,
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

    if (!interview) throw new AppError("Interview not found", 404);
    if (interview.user_id.toString() !== userId)
        throw new AppError("Access denied", 403);

    const round = interview.rounds[roundIndex];
    if (!round) throw new AppError(`Round ${roundIndex} not found`, 404);
    if (round.status !== "ongoing")
        throw new AppError("Round is not active", 400);

    const job = interview.job_id;
    const maxQuestions = interview.questions_per_round;
    const aiMessageCount = round.messages.filter(
        (m: any) => m.role === "ai",
    ).length;

    // Save candidate answer
    interview.rounds[roundIndex].messages.push({
        role: "candidate",
        content: candidateAnswer,
        timestamp: new Date(),
    });

    if (aiMessageCount >= maxQuestions) {
        return await _finalizeRound(interview, roundIndex);
    }

    const history = formatHistory(round.messages);
    const prompt = buildPrompt(
        job.role,
        round.type,
        aiMessageCount + 1,
        maxQuestions,
        history,
        candidateAnswer,
    );

    const model = getGeminiModel(true);
    const result = await model.generateContent(prompt);
    const aiData: GeminiResponse = JSON.parse(result.response.text());

    interview.rounds[roundIndex].messages.push({
        role: "ai",
        content: aiData.spoken_response,
        timestamp: new Date(),
    });

    if (aiData.is_complete || aiMessageCount + 1 >= maxQuestions) {
        return await _finalizeRound(interview, roundIndex);
    }

    await interview.save();
    return { interview, round: interview.rounds[roundIndex], roundIndex };
};

export const getRoundService = async (
    interviewId: string,
    roundIndex: number,
    userId: string,
) => {
    const interview = await Interview.findById(interviewId);
    if (!interview || interview.user_id.toString() !== userId)
        throw new AppError("Not found or denied", 404);

    const round = interview.rounds[roundIndex];
    if (!round) throw new AppError("Round not found", 404);

    return { interview, round, roundIndex };
};

// ─── Private ──────────────────────────────────────────────────────────────────

const _finalizeRound = async (interview: any, roundIndex: number) => {
    const round = interview.rounds[roundIndex];
    const model = getGeminiModel(true);
    const transcript = formatHistory(round.messages);

    const summaryPrompt = `Review this technical interview round transcript:\n${transcript}\n\nProvide JSON: {"summary": "2 sentences", "final_score": 7}`;

    let summary = "Round completed.";
    let finalScore = 5;

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

    // Check if ALL rounds are complete to finalize the entire interview
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
        interview.remarks = `Interview completed. Average score: ${avgScore}/10.`;
    }

    await interview.save();
    return { interview, round: interview.rounds[roundIndex], roundIndex };
};
