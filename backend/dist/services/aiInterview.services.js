"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoundService = exports.answerInRoundService = exports.startRoundService = void 0;
const interview_model_1 = require("../models/interview.model");
const AppError_utils_1 = require("../utils/AppError.utils");
const gemini_config_1 = require("../config/gemini.config");
const formatHistory = (qaPairs) => {
    return qaPairs
        .filter((qa) => qa.question)
        .map((qa, index) => `Round ${index + 1}:\nQ: ${qa.question}\nA: ${qa.candidate_answer || "[No answer provided]"}\nEvaluation: ${qa.ai_evaluation || "[Pending]"}`)
        .join("\n\n");
};
const buildPrompt = (jobRole, roundType, questionNumber, maxQuestions, history, candidateAnswer) => {
    const isFirst = !candidateAnswer;
    return `You are a professional Technical Interviewer for a ${jobRole} position.
            Current Round: ${roundType}
            Progress: Question ${questionNumber} of ${maxQuestions}

            ${isFirst
        ? "Greet the candidate and ask the first technical question related to the job role."
        : `INTERVIEW HISTORY:\n${history}\n\nLATEST ANSWER FROM CANDIDATE: "${candidateAnswer}"\n\nEvaluate the candidate's last answer critically, then ask the next technical question.`}

            STRICT RULES:
            1. Keep your tone professional and encouraging.
            2. If the candidate's answer is vague, ask a follow-up to probe deeper.
            3. If this is question ${maxQuestions}, set 'is_complete' to true and do not ask a next question.
            4. Respond ONLY in JSON.

            JSON STRUCTURE:
            {
                "evaluation_of_previous_answer": "Constructive feedback on the last answer",
                "next_question": "The next technical question to ask",
                "is_complete": boolean
            }`;
};
const startRoundService = async (interviewId, roundIndex, userId) => {
    const interview = await interview_model_1.Interview.findById(interviewId).populate("job_id");
    if (!interview)
        throw new AppError_utils_1.AppError("Interview Not found", 404);
    if (interview.user_id.toString() !== userId)
        throw new AppError_utils_1.AppError("Access denied", 403);
    const round = interview.rounds[roundIndex];
    if (round.status === "completed")
        throw new AppError_utils_1.AppError("Round already completed", 400);
    if (round.qa_pairs.length > 0)
        return { interview, round, roundIndex };
    const prompt = buildPrompt(interview.job_id.role, round.type, 1, round.max_questions, "");
    const model = (0, gemini_config_1.getGeminiModel)(true);
    const result = await model.generateContent(prompt);
    let aiData;
    try {
        aiData = JSON.parse(result.response.text());
    }
    catch (e) {
        throw new AppError_utils_1.AppError("AI generation failed. Please try again.", 502);
    }
    interview.rounds[roundIndex].qa_pairs.push({
        question: aiData.next_question,
        timestamp: new Date(),
    });
    interview.rounds[roundIndex].status = "ongoing";
    interview.status = "ongoing";
    await interview.save();
    return { interview, round: interview.rounds[roundIndex], roundIndex };
};
exports.startRoundService = startRoundService;
const answerInRoundService = async (interviewId, roundIndex, candidateAnswer, userId, audioBuffer) => {
    const interview = await interview_model_1.Interview.findById(interviewId).populate("job_id");
    if (!interview)
        throw new AppError_utils_1.AppError("Interview Not found", 404);
    if (interview.user_id.toString() !== userId)
        throw new AppError_utils_1.AppError("Access denied", 403);
    const current_round = interview.rounds[roundIndex];
    if (current_round.status !== "ongoing")
        throw new AppError_utils_1.AppError("Round is not active", 400);
    const currentQuestionIndex = current_round.qa_pairs.length - 1;
    if (currentQuestionIndex < 0)
        throw new AppError_utils_1.AppError("No active question found", 400);
    // Save whatever we have (text or note about audio)
    current_round.qa_pairs[currentQuestionIndex].candidate_answer =
        candidateAnswer || "[Audio Response]";
    const maxQuestions = current_round.max_questions;
    const history = formatHistory(current_round.qa_pairs);
    const prompt = buildPrompt(interview.job_id.role, current_round.type, currentQuestionIndex + 2, maxQuestions, history, candidateAnswer || "The candidate provided a voice response.");
    const model = (0, gemini_config_1.getGeminiModel)(true);
    // Construct parts for multimodal generation
    const parts = [prompt];
    if (audioBuffer) {
        parts.push({
            inlineData: {
                data: audioBuffer.toString("base64"),
                mimeType: "audio/wav", // Multimodal support
            },
        });
    }
    const result = await model.generateContent(parts);
    let aiData;
    try {
        aiData = JSON.parse(result.response.text());
    }
    catch (e) {
        throw new AppError_utils_1.AppError("AI response error. Please resubmit.", 502);
    }
    current_round.qa_pairs[currentQuestionIndex].ai_evaluation =
        aiData.evaluation_of_previous_answer;
    if (aiData.is_complete || current_round.qa_pairs.length >= maxQuestions) {
        return await _finalizeRound(interview, roundIndex);
    }
    else {
        current_round.qa_pairs.push({
            question: aiData.next_question,
            timestamp: new Date(),
        });
    }
    interview.markModified(`rounds.${roundIndex}.qa_pairs`);
    await interview.save();
    return { interview, round: current_round, roundIndex };
};
exports.answerInRoundService = answerInRoundService;
const getRoundService = async (interviewId, roundIndex, userId) => {
    const interview = await interview_model_1.Interview.findById(interviewId);
    if (!interview)
        throw new AppError_utils_1.AppError("Interview Not found", 404);
    if (interview.user_id.toString() !== userId)
        throw new AppError_utils_1.AppError("Access denied", 403);
    const round = interview.rounds[roundIndex];
    if (!round)
        throw new AppError_utils_1.AppError("Round not found", 404);
    return { interview, round, roundIndex };
};
exports.getRoundService = getRoundService;
const _finalizeRound = async (interview, roundIndex) => {
    const round = interview.rounds[roundIndex];
    const model = (0, gemini_config_1.getGeminiModel)(true);
    const transcript = formatHistory(round.qa_pairs);
    const summaryPrompt = `Critically review this technical interview round for a ${interview.job_id.role} role:\n\nTRANSCRIPT:\n${transcript}\n\nProvide a final summary and a numeric score (0-100) based on technical accuracy, communication, and depth of knowledge. Ensure the JSON format is strictly followed.`;
    let summary = "Round completed.";
    let finalScore = 50;
    try {
        const result = await model.generateContent(summaryPrompt);
        const data = JSON.parse(result.response.text());
        summary =
            data.summary ||
                data.evaluation_of_previous_answer ||
                "Assessment complete.";
        finalScore = data.final_score || data.score || 50;
    }
    catch {
        console.error("Failed to generate round summary, using fallbacks.");
    }
    interview.rounds[roundIndex].status = "completed";
    interview.rounds[roundIndex].score = finalScore;
    interview.rounds[roundIndex].remarks = summary;
    const allDone = interview.rounds.every((r) => r.status === "completed" || r.status === "failed");
    if (allDone) {
        const completedRounds = interview.rounds.filter((r) => r.status === "completed");
        const avgScore = completedRounds.length > 0
            ? Math.round(completedRounds.reduce((sum, r) => sum + (r.score || 0), 0) / completedRounds.length)
            : 0;
        interview.score = avgScore;
        interview.status = "completed";
        interview.remarks = `Interview series concluded. Final performance score: ${avgScore}/100.`;
    }
    await interview.save();
    return { interview, round: interview.rounds[roundIndex], roundIndex };
};
