import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";
import { getGeminiModel } from "../config/gemini.config";
import { AppError } from "../utils/AppError.utils";

export const scanResume = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.file) throw new AppError("Please upload a resume (PDF)", 400);

        const isPdf =
            req.file.mimetype === "application/pdf" ||
            req.file.originalname.toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            throw new AppError("Only PDF files are supported.", 400);
        }

        const buffer = req.file.buffer;
        const pdfParse = (await import("pdf-parse")).default as unknown as (
            dataBuffer: Buffer,
        ) => Promise<{ text?: string }>;
        const parsed = await pdfParse(buffer);
        const extractedText = (parsed.text ?? "").trim();

        if (!extractedText || extractedText.length < 50) {
            throw new AppError(
                "Could not extract meaningful text from this PDF.",
                422,
            );
        }

        const model = getGeminiModel(true);
        const prompt = `You are an expert HR and ATS Optimizer. Analyze this resume text:
        
        ---
        ${extractedText.slice(0, 20000)}
        ---

        Provide:
        1. Extracted Skills (list)
        2. Experience Summary (1 paragraph)
        3. ATS Compatibility Score (0-100)
        4. Detailed suggestions for improvement to rank higher in technical screenings.
        
        Respond strictly in JSON format:
        {
          "skills": [],
          "experience_summary": "",
          "ats_score": 0,
          "suggestions": ""
        }`;

        const result = await model.generateContent(prompt);
        const data = JSON.parse(result.response.text());

        res.status(200).json({
            success: true,
            message: "Resume scanned successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};
