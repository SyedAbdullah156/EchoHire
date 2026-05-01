"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeminiModel = void 0;
const generative_ai_1 = require("@google/generative-ai");
const env_config_1 = require("../config/env.config");
const genAI = new generative_ai_1.GoogleGenerativeAI(env_config_1.env.GEMINI_API_KEY);
const getGeminiModel = (jsonMode = false) => {
    return genAI.getGenerativeModel({
        model: env_config_1.env.GEMINI_MODEL,
        generationConfig: jsonMode ? { responseMimeType: "application/json" } : {}
    });
};
exports.getGeminiModel = getGeminiModel;
