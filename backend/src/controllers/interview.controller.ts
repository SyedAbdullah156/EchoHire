import { Request, Response, NextFunction } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppError } from "../utils/AppError.utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const getNextQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { targetRole, previousQuestion, candidateAnswer } = req.body;

        if (!targetRole || !candidateAnswer) {
            throw new AppError(
                "Target role and candidate answer are required",
                400,
            );
        }

        // We use Flash because it's the fastest model (perfect for real-time chat)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // This is the "Brain" of your Phase 1 interviewer
        const prompt = `
            You are a technical interviewer hiring for a ${targetRole} position.
            
            Context:
            - You just asked the candidate: "${previousQuestion || "Tell me about yourself."}"
            - The candidate replied: "${candidateAnswer}"

            Task:
            1. Analyze their answer.
            2. If it was weak, ask a clarifying question. If it was strong, ask a harder follow-up question.
            3. Act exactly like a human interviewer. Do not say "Here is my next question". 
            4. Respond ONLY with the exact text of the next question you want to ask.
        `;

        const result = await model.generateContent(prompt);
        const nextQuestion = result.response.text().trim();

        res.status(200).json({
            success: true,
            data: {
                aiResponse: nextQuestion,
            },
        });
    } catch (error) {
        next(error);
    }
};
