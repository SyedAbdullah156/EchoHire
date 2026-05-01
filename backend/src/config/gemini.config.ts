import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.config";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const getGeminiModel = (jsonMode: boolean = false) => {
    return genAI.getGenerativeModel({ 
        model: env.GEMINI_MODEL,
        generationConfig: jsonMode ? { responseMimeType: "application/json" } : {}
    });
};