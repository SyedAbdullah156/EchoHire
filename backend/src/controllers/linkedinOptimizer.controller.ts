import { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/AppError.utils";
import { analyzeLinkedinProfileWithGemini } from "../services/linkedinOptimizer.services";

const MAX_EXTRACTED_CHARS = 25_000;

export const analyzeLinkedinPdf = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.file) {
            throw new AppError("PDF file is required (field name: file).", 400);
        }

        const isPdf =
            req.file.mimetype === "application/pdf" ||
            req.file.originalname.toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            throw new AppError("Only PDF files are supported.", 400);
        }

        const buffer = req.file.buffer;
        // pdf-parse ships ESM/CJS builds; dynamic import avoids TS/ts-node interop issues
        const pdfParse = require("pdf-parse");
        const parsed = await pdfParse(buffer);
        const extractedRaw = (parsed.text ?? "").replace(/\s+\n/g, "\n").trim();

        if (!extractedRaw || extractedRaw.length < 50) {
            throw new AppError(
                "Could not extract meaningful text from this PDF.",
                422,
            );
        }

        const extractedText =
            extractedRaw.length > MAX_EXTRACTED_CHARS
                ? extractedRaw.slice(0, MAX_EXTRACTED_CHARS)
                : extractedRaw;

        const analysis = await analyzeLinkedinProfileWithGemini(extractedText);

        res.status(200).json({
            success: true,
            data: analysis,
            meta: {
                extractedChars: extractedRaw.length,
                truncated: extractedRaw.length > extractedText.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const analyzeLinkedinText = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { text } = req.body;
        if (!text || text.length < 50) {
            throw new AppError("Please provide valid profile text for analysis.", 400);
        }

        const cleanText = text.length > MAX_EXTRACTED_CHARS ? text.slice(0, MAX_EXTRACTED_CHARS) : text;
        const analysis = await analyzeLinkedinProfileWithGemini(cleanText);

        res.status(200).json({
            success: true,
            data: analysis,
        });
    } catch (error) {
        next(error);
    }
};
