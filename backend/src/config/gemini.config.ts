// src/config/gemini.config.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const getGeminiModel = (jsonMode: boolean = true) => {
    return genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
        generationConfig: {
            ...(jsonMode && { responseMimeType: "application/json" }),
        }
    });
};