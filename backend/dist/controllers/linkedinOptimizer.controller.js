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
exports.analyzeLinkedinPdf = void 0;
const AppError_utils_1 = require("../utils/AppError.utils");
const linkedinOptimizer_services_1 = require("../services/linkedinOptimizer.services");
const MAX_EXTRACTED_CHARS = 25_000;
const analyzeLinkedinPdf = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new AppError_utils_1.AppError("PDF file is required (field name: file).", 400);
        }
        const isPdf = req.file.mimetype === "application/pdf" ||
            req.file.originalname.toLowerCase().endsWith(".pdf");
        if (!isPdf) {
            throw new AppError_utils_1.AppError("Only PDF files are supported.", 400);
        }
        const buffer = req.file.buffer;
        // pdf-parse ships ESM/CJS builds; dynamic import avoids TS/ts-node interop issues
        const pdfParse = (await Promise.resolve().then(() => __importStar(require("pdf-parse")))).default;
        const parsed = await pdfParse(buffer);
        const extractedRaw = (parsed.text ?? "").replace(/\s+\n/g, "\n").trim();
        if (!extractedRaw || extractedRaw.length < 50) {
            throw new AppError_utils_1.AppError("Could not extract meaningful text from this PDF.", 422);
        }
        const extractedText = extractedRaw.length > MAX_EXTRACTED_CHARS
            ? extractedRaw.slice(0, MAX_EXTRACTED_CHARS)
            : extractedRaw;
        const analysis = await (0, linkedinOptimizer_services_1.analyzeLinkedinProfileWithGemini)(extractedText);
        res.status(200).json({
            success: true,
            data: analysis,
            meta: {
                extractedChars: extractedRaw.length,
                truncated: extractedRaw.length > extractedText.length,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.analyzeLinkedinPdf = analyzeLinkedinPdf;
