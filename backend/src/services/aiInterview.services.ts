import { Interview } from "../models/interview.model";
import { AppError } from "../utils/AppError.utils";
import { getGeminiModel } from "../config/gemini.config";

interface GeminiResponse {
    evaluation_of_previous_answer?: string;
    next_question?: string;
    is_complete?: boolean;
    summary?: string;
    final_score?: number;
    score?: number;
}

const parseAIResponse = (rawText: string) => {
    const cleanedText = rawText
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "");

    return JSON.parse(cleanedText);
};

const formatHistory = (qaPairs: any[]): string => {
    return qaPairs
        .filter((qa) => qa.question)
        .map(
            (qa, index) =>
                `Round ${index + 1}:
Q: ${qa.question}
A: ${qa.candidate_answer || "[No answer provided]"}
Evaluation: ${qa.ai_evaluation || "[Pending]"}`,
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
    customQuestions?: string[],
    techStack?: string
): string => {
    const isFirst = !candidateAnswer;
    const trimmedHistory = history ? history.split("\n\n").slice(-3).join("\n\n") : "";

    let phaseInstructions = "";

    switch (roundType) {
        case "TechnicalScreening":
            phaseInstructions = isFirst 
                ? "Greet the candidate as a Turing-Style Evaluator. Ask them to specify their primary programming language and core framework (e.g., Python/Django)."
                : "Acknowledge their stack choice. Explain that answers are final and no external IDEs are allowed. Briefly mention that we will move to the technical quiz next.";
            break;
        case "FrameworkProficiency":
            phaseInstructions = `You are in the Advanced Quiz Phase for ${techStack || "the chosen stack"}. 
            Present Question ${questionNumber} of 3. It must be a highly technical Multiple Choice Question testing deep internals or memory management. 
            Provide 4 options (A, B, C, D). Wait for the answer before moving to the next.`;
            break;
        case "CodingAssessment":
            phaseInstructions = `Present a Medium to Hard LeetCode problem related to ${techStack || "Software Engineering"}. 
            Provide Problem Statement, Constraints, and 2 Examples. 
            Instruct the candidate to write code directly. You will evaluate correctness and Big O complexity later.`;
            break;
        case "SystemArchitecture":
            phaseInstructions = `Present a System Design challenge: "How would you design [System] using ${techStack || "your stack"} for [Scale]?" 
            Evaluate based on scalability, database choice, and caching.`;
            break;
        default:
            phaseInstructions = `Technical interview for ${jobRole}. One question at a time.`;
    }

    return `Role: Turing-Style Technical Evaluator.
Objective: Rigorous vetting. Tone: Professional, concise, objective.

Round: ${roundType} (${questionNumber}/${maxQuestions})
${techStack ? `Candidate Stack: ${techStack}` : ""}

${phaseInstructions}

${!isFirst ? `Recent history:\n${trimmedHistory}\n\nCandidate answered: "${candidateAnswer}"\n\nEvaluate briefly (don't reveal correct MCQ answers yet) and proceed.` : ""}

Rules: 
1. JSON ONLY. 
2. One question/interaction only. 
3. ${questionNumber >= maxQuestions ? "Set is_complete: true." : "Set is_complete: false."}

JSON Structure:
{"evaluation_of_previous_answer":"...","next_question":"...","is_complete":false}`;
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
        throw new AppError("Access denied", 403);

    const round = interview.rounds[roundIndex];
    if (!round) throw new AppError("Round not found", 404);
    if (round.status === "completed")
        throw new AppError("Round already completed", 400);

    if (round.qa_pairs.length > 0) return { interview, round, roundIndex };

    const jobRole = interview.job_id?.role || "Software Engineering";
    const customQuestions = interview.job_id?.custom_questions || [];
    const prompt = buildPrompt(jobRole, round.type, 1, round.max_questions, "", undefined, customQuestions, interview.tech_stack);

    const model = getGeminiModel(true);
    const result = await model.generateContent(prompt);

    let aiData: GeminiResponse;
    try {
        aiData = parseAIResponse(result.response.text());
    } catch (e) {
        console.error("AI Parse Error:", e);
        throw new AppError(
            "AI generation failed to return valid JSON. Please try again.",
            502,
        );
    }

    interview.rounds[roundIndex].qa_pairs.push({
        question: aiData.next_question,
        timestamp: new Date(),
    });

    interview.rounds[roundIndex].status = "in-progress";
    interview.status = "in-progress";

    interview.markModified("rounds");
    await interview.save();

    return { interview, round: interview.rounds[roundIndex], roundIndex };
};

export const answerInRoundService = async (
    interviewId: string,
    roundIndex: number,
    candidateAnswer: string | undefined,
    userId: string,
    audioBuffer?: Buffer,
) => {
    const interview: any =
        await Interview.findById(interviewId).populate("job_id");
    if (!interview) throw new AppError("Interview Not found", 404);
    if (interview.user_id.toString() !== userId)
        throw new AppError("Access denied", 403);

    const currentRound = interview.rounds[roundIndex];
    if (!currentRound) throw new AppError("Round not found", 404);
    if (currentRound.status !== "in-progress")
        throw new AppError("Round is not active", 400);

    const currentQuestionIndex = currentRound.qa_pairs.length - 1;
    if (currentQuestionIndex < 0)
        throw new AppError("No active question found", 400);

    const maxQuestions = currentRound.max_questions;
    const history = formatHistory(currentRound.qa_pairs);
    const jobRole = interview.job_id?.role || "Software Engineering";
    const customQuestions = interview.job_id?.custom_questions || [];

    // Capture Tech Stack in Phase 1
    if (currentRound.type === "TechnicalScreening" && !interview.tech_stack && candidateAnswer) {
        interview.tech_stack = candidateAnswer.trim();
    }

    const prompt = buildPrompt(
        jobRole,
        currentRound.type,
        currentQuestionIndex + 2,
        maxQuestions,
        history,
        candidateAnswer || "The candidate provided a voice response.",
        customQuestions,
        interview.tech_stack
    );

    const model = getGeminiModel(true);
    const parts: any[] = [prompt];

    if (audioBuffer) {
        parts.push({
            inlineData: {
                data: audioBuffer.toString("base64"),
                mimeType: "audio/wav",
            },
        });
    }

    const result = await model.generateContent(parts);

    let aiData: GeminiResponse;
    try {
        aiData = parseAIResponse(result.response.text());
    } catch (e) {
        console.error("AI Parse Error:", e);
        throw new AppError("AI response error. Please resubmit.", 502);
    }

    interview.rounds[roundIndex].qa_pairs[
        currentQuestionIndex
    ].candidate_answer = candidateAnswer || "[Audio Response]";
    interview.rounds[roundIndex].qa_pairs[currentQuestionIndex].ai_evaluation =
        aiData.evaluation_of_previous_answer;

    if (aiData.is_complete || currentRound.qa_pairs.length >= maxQuestions) {
        await _finalizeRound(interview, roundIndex);
        interview.markModified("rounds");
        await interview.save();
        return { interview, round: interview.rounds[roundIndex], roundIndex };
    }

    interview.rounds[roundIndex].qa_pairs.push({
        question: aiData.next_question,
        timestamp: new Date(),
    });

    interview.markModified("rounds");
    await interview.save();

    return { interview, round: interview.rounds[roundIndex], roundIndex };
};

export const getRoundService = async (
    interviewId: string,
    roundIndex: number,
    userId: string,
) => {
    const interview = await Interview.findById(interviewId);
    if (!interview) throw new AppError("Interview Not found", 404);
    if (interview.user_id.toString() !== userId)
        throw new AppError("Access denied", 403);

    const round = interview.rounds[roundIndex];
    if (!round) throw new AppError("Round not found", 404);

    return { interview, round, roundIndex };
};

const _finalizeRound = async (interview: any, roundIndex: number) => {
    const round = interview.rounds[roundIndex];
    const model = getGeminiModel(true);
    const transcript = formatHistory(round.qa_pairs);
    const jobRole = interview.job_id?.role || "the specified";

    const summaryPrompt = `Critically review this technical interview round for a ${jobRole} role:

TRANSCRIPT:
${transcript}

Provide a final summary and a numeric score (0-100) based on technical accuracy, communication, and depth of knowledge.
STRICT RULE: Return ONLY a raw JSON object matching exactly this structure:
{
  "summary": "Your detailed evaluation here",
  "final_score": 85
}`;

    let summary = "Round completed.";
    let finalScore = 50;

    try {
        const result = await model.generateContent(summaryPrompt);
        const data = parseAIResponse(result.response.text());

        summary =
            data.summary ||
            data.evaluation_of_previous_answer ||
            "Assessment complete.";
        finalScore =
            typeof data.final_score === "number"
                ? data.final_score
                : typeof data.score === "number"
                  ? data.score
                  : 50;
    } catch (err) {
        console.error(
            "Failed to generate round summary, using fallbacks.",
            err,
        );
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
        interview.remarks = `Interview series concluded. Final performance score: ${avgScore}/100.`;
    }

    interview.markModified("rounds");
    return { interview, round: interview.rounds[roundIndex], roundIndex };
};

export const answerInRoundStreamingService = async (
    interviewId: string,
    roundIndex: number,
    candidateAnswer: string | undefined,
    userId: string,
    onChunk: (chunk: string) => void,
    audioBuffer?: Buffer,
) => {
    // 1. Initial fetch and security check
    const interview: any = await Interview.findById(interviewId).populate("job_id");
    if (!interview) throw new AppError("Interview Not found", 404);
    if (interview.user_id.toString() !== userId)
        throw new AppError("Access denied", 403);

    const currentRound = interview.rounds[roundIndex];
    if (!currentRound) throw new AppError("Round not found", 404);
    if (currentRound.status !== "in-progress")
        throw new AppError("Round is not active", 400);

    const currentQuestionIndex = currentRound.qa_pairs.length - 1;
    const maxQuestions = currentRound.max_questions;
    const history = formatHistory(currentRound.qa_pairs);
    const jobRole = interview.job_id?.role || "Software Engineering";
    const customQuestions = interview.job_id?.custom_questions || [];

    // Capture Tech Stack in Phase 1
    if (currentRound.type === "TechnicalScreening" && !interview.tech_stack && candidateAnswer) {
        interview.tech_stack = candidateAnswer.trim();
    }

    // 2. Build and send streaming request
    const prompt = `Role: Turing-Style Technical Evaluator.
Objective: Rigorous vetting. Tone: Professional, concise, objective.

Round: ${currentRound.type} (${currentQuestionIndex + 1}/${maxQuestions})
${interview.tech_stack ? `Candidate Stack: ${interview.tech_stack}` : ""}

INTERVIEW HISTORY:
${history}

LATEST ANSWER FROM CANDIDATE: "${candidateAnswer || "The candidate provided a voice response."}"

Rules:
1. One question/interaction only.
2. If this is a Technical Quiz (FrameworkProficiency), provide an advanced MCQ with 4 options.
3. If this is Coding Assessment, present a Medium/Hard LeetCode problem.
4. ${currentQuestionIndex + 1 >= maxQuestions ? "Complete the round." : "Ask the next question."}

STRICT FORMAT: 
[EVALUATION] your feedback here
[QUESTION] your next question here
[COMPLETE] ${currentQuestionIndex + 1 >= maxQuestions ? "true" : "false"}`;

    const model = getGeminiModel(false);
    const parts: any[] = [prompt];
    if (audioBuffer) {
        parts.push({
            inlineData: {
                data: audioBuffer.toString("base64"),
                mimeType: "audio/wav",
            },
        });
    }

    const result = await model.generateContentStream(parts);
    let fullResponse = "";

    for await (const chunk of result.stream) {
        const text = chunk.text();
        fullResponse += text;
        onChunk(text);
    }

    // 3. Post-stream processing: Parse and update the ALREADY fetched document
    const evaluation =
        fullResponse.match(/\[EVALUATION\](.*?)\[QUESTION\]/s)?.[1]?.trim() ||
        "Good answer.";
    const nextQuestion =
        fullResponse.match(/\[QUESTION\](.*?)\[COMPLETE\]/s)?.[1]?.trim() ||
        "Next question...";
    const isComplete = /\[COMPLETE\]\s*(:?\s*true|yes)/i.test(fullResponse);

    currentRound.qa_pairs[currentQuestionIndex].candidate_answer =
        candidateAnswer || "[Audio Response]";
    currentRound.qa_pairs[currentQuestionIndex].ai_evaluation = evaluation;

    if (isComplete || currentRound.qa_pairs.length >= maxQuestions) {
        await _finalizeRound(interview, roundIndex);
    } else {
        currentRound.qa_pairs.push({
            question: nextQuestion,
            timestamp: new Date(),
        });
    }

    interview.markModified("rounds");
    await interview.save();
};
