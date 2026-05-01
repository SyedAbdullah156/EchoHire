"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanResume = void 0;
const gemini_config_1 = require("../config/gemini.config");
const AppError_utils_1 = require("../utils/AppError.utils");
const scanResume = async (req, res, next) => {
    try {
        if (!req.file)
            throw new AppError_utils_1.AppError("Please upload a resume (PDF)", 400);
        const isPdf = req.file.mimetype === "application/pdf" ||
            req.file.originalname.toLowerCase().endsWith(".pdf");
        if (!isPdf) {
            throw new AppError_utils_1.AppError("Only PDF files are supported.", 400);
        }
        const buffer = req.file.buffer;
        const pdfParse = (await Promise.resolve().then(() => __importStar(require("pdf-parse")))).default;
        const parsed = await pdfParse(buffer);
        const extractedText = (parsed.text ?? "").trim();
        if (!extractedText || extractedText.length < 50) {
            throw new AppError_utils_1.AppError("Could not extract meaningful text from this PDF.", 422);
        }
        const model = (0, gemini_config_1.getGeminiModel)(true);
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
    }
    catch (error) {
        next(error);
    }
};
exports.scanResume = scanResume;
