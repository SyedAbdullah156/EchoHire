import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { AppError } from "../utils/apperror.utls";

const LinkedinOptimizerSchema = z.object({
  overallScore: z.number().min(0).max(100),
  issues: z.array(z.string().min(1)).default([]),
  suggestedImprovements: z.array(z.string().min(1)).default([]),
  improvedHeadline: z.string().min(1),
});

export type LinkedinOptimizerResult = z.infer<typeof LinkedinOptimizerSchema>;

const stripJsonFences = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
  }
  return trimmed;
};

const safeJsonParse = (text: string) => {
  const cleaned = stripJsonFences(text);
  return JSON.parse(cleaned) as unknown;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown Gemini error";
  }
};

const DEFAULT_LATEST_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
];

const getModelsFromEnv = () => {
  const configuredPrimary = process.env.GEMINI_MODEL?.trim();
  const configuredList = (process.env.GEMINI_MODELS ?? "")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  const models = [
    ...(configuredPrimary ? [configuredPrimary] : []),
    ...configuredList,
    ...DEFAULT_LATEST_MODELS,
  ];

  return Array.from(new Set(models));
};

const buildPrompt = (extractedText: string) => {
  return `You are a LinkedIn profile expert.

Analyze the following LinkedIn profile content and identify issues.

Check for:
- Weak headline
- Missing keywords
- Poor summary
- Lack of achievements
- Bad formatting

Return ONLY valid JSON (no markdown, no extra text) in exactly this shape:
{
  "overallScore": number, // 0-100
  "issues": string[],
  "suggestedImprovements": string[],
  "improvedHeadline": string
}

Profile:
"""
${extractedText}
"""`;
};

export const analyzeLinkedinProfileWithGemini = async (extractedText: string): Promise<LinkedinOptimizerResult> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AppError("GEMINI_API_KEY is not set on the backend.", 500);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = buildPrompt(extractedText);
  const modelsToTry = getModelsFromEnv();

  let outputText = "";
  const requestErrors: string[] = [];

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      outputText = result.response.text();
      if (outputText.trim()) break;
      requestErrors.push(`${modelName}: empty response`);
    } catch (error) {
      requestErrors.push(`${modelName}: ${getErrorMessage(error)}`);
    }
  }

  if (!outputText.trim()) {
    throw new AppError(
      `Gemini request failed. ${requestErrors.join(" | ")}`,
      502,
    );
  }

  try {
    const parsed = safeJsonParse(outputText);
    return LinkedinOptimizerSchema.parse(parsed);
  } catch (error) {
    throw new AppError(
      "Gemini returned an unexpected response format. Try again, or reduce the PDF content size.",
      502,
    );
  }
};

