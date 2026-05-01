"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeLinkedinProfileWithGemini = void 0;
const zod_1 = require("zod");
const AppError_utils_1 = require("../utils/AppError.utils");
const gemini_config_1 = require("../config/gemini.config");
const LinkedinOptimizerSchema = zod_1.z.object({
    overallScore: zod_1.z.number().min(0).max(100),
    issues: zod_1.z.array(zod_1.z.string().min(1)).default([]),
    suggestedImprovements: zod_1.z.array(zod_1.z.string().min(1)).default([]),
    improvedHeadline: zod_1.z.string().min(1),
});
const buildPrompt = (extractedText) => {
    return `You are a world-class LinkedIn profile optimizer and career coach.
    
    Analyze the following LinkedIn profile (extracted text) and provide a detailed audit.
    Focus on keyword optimization for recruitment algorithms, headline impact, and readability.

    PROFILE CONTENT:
    """
    ${extractedText.slice(0, 15000)}
    """

    Respond strictly in JSON format with these fields:
    {
      "overallScore": number, // 0-100 score based on completeness and impact
      "issues": string[], // List of specific flaws or missing sections
      "suggestedImprovements": string[], // Actionable steps to improve the profile
      "improvedHeadline": string // A high-impact, SEO-optimized headline suggestion
    }`;
};
const analyzeLinkedinProfileWithGemini = async (extractedText) => {
    try {
        const model = (0, gemini_config_1.getGeminiModel)(true);
        const prompt = buildPrompt(extractedText);
        const result = await model.generateContent(prompt);
        const outputText = result.response.text();
        if (!outputText.trim()) {
            throw new AppError_utils_1.AppError("Gemini returned an empty response.", 502);
        }
        const parsed = JSON.parse(outputText);
        return LinkedinOptimizerSchema.parse(parsed);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new AppError_utils_1.AppError("Failed to parse AI optimization results.", 502);
        }
        throw error;
    }
};
exports.analyzeLinkedinProfileWithGemini = analyzeLinkedinProfileWithGemini;
