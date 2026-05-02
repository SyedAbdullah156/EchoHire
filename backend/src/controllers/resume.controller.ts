import { Response, NextFunction, Request } from "express";
import { getGeminiModel } from "../config/gemini.config";
import { AppError } from "../utils/AppError.utils";

export const scanResume = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.file) throw new AppError("Please upload a resume (PDF or DOCX)", 400);

        const isPdf =
            req.file.mimetype === "application/pdf" ||
            req.file.originalname.toLowerCase().endsWith(".pdf");

        const isDocx =
            req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            req.file.originalname.toLowerCase().endsWith(".docx");

        if (!isPdf && !isDocx) {
            throw new AppError("Only PDF and DOCX files are supported.", 400);
        }

        let extractedText = "";

        if (isPdf) {
            const pdfParse = require("pdf-parse");
            const parsed = await pdfParse(req.file.buffer);
            extractedText = (parsed.text ?? "").trim();
        } else {
            // DOCX support via mammoth
            const mammoth = require("mammoth");
            const result = await mammoth.extractRawText({ buffer: req.file.buffer });
            extractedText = (result.value ?? "").trim();
        }

        if (!extractedText || extractedText.length < 50) {
            throw new AppError(
                "Could not extract meaningful text from this file. Make sure the file is not scanned/image-based.",
                422,
            );
        }

        const model = getGeminiModel(true);

        const prompt = `You are an expert ATS Optimizer and Senior HR Recruiter.
Analyze the following resume text and respond ONLY with a valid JSON object.
No markdown, no code fences, no explanation — pure JSON only.

Resume Text:
---
${extractedText.slice(0, 20000)}
---

Return this exact JSON structure:
{
  "candidateName": "string (extract from resume, or 'Unknown Candidate')",
  "overallScore": number (0-100, ATS compatibility score),
  "bestFitJobs": ["job title 1", "job title 2", "job title 3", "...up to 5 concise titles"],
  "topSkills": ["skill1", "skill2", "skill3", "...up to 10"],
  "strengths": ["strength1", "strength2", "strength3", "...up to 5"],
  "weaknesses": ["weakness1", "weakness2", "weakness3", "...up to 5"],
  "suggestedInterviewQuestions": ["question1", "question2", "question3", "question4", "question5"]
}`;

        const geminiResult = await model.generateContent(prompt);
        const rawText = geminiResult.response.text().trim();

        // Strip any accidental markdown fences
        const cleaned = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();

        let data: any;
        try {
            data = JSON.parse(cleaned);
        } catch {
            throw new AppError("AI returned an invalid response. Please try again.", 500);
        }

        // Validate required fields
        if (
            typeof data.candidateName !== "string" ||
            typeof data.overallScore !== "number" ||
            !Array.isArray(data.bestFitJobs) ||
            !Array.isArray(data.topSkills) ||
            !Array.isArray(data.strengths) ||
            !Array.isArray(data.weaknesses) ||
            !Array.isArray(data.suggestedInterviewQuestions)
        ) {
            throw new AppError("AI response has unexpected structure. Please try again.", 500);
        }

        res.status(200).json({
            success: true,
            message: "Resume analyzed successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};
