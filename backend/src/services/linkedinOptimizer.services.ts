import { z } from "zod";
import { AppError } from "../utils/AppError.utils";
import { getGeminiModel } from "../config/gemini.config";

const LinkedinOptimizerSchema = z.object({
    overallScore: z.number().min(0).max(100),
    issues: z.array(z.string().min(1)).default([]),
    suggestedImprovements: z.array(z.string().min(1)).default([]),
    improvedHeadline: z.string().min(1),
});

export type LinkedinOptimizerResult = z.infer<typeof LinkedinOptimizerSchema>;

const buildPrompt = (extractedText: string) => {
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

export const analyzeLinkedinProfileWithGemini = async (
    extractedText: string,
): Promise<LinkedinOptimizerResult> => {
    try {
        const model = getGeminiModel(true);
        const prompt = buildPrompt(extractedText);

        const result = await model.generateContent(prompt);
        const outputText = result.response.text();

        if (!outputText.trim()) {
            throw new AppError("Gemini returned an empty response.", 502);
        }

        const parsed = JSON.parse(outputText);
        return LinkedinOptimizerSchema.parse(parsed);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new AppError("Failed to parse AI optimization results.", 502);
        }
        throw error;
    }
};
