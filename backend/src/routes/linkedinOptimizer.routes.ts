import express from "express";
import upload from "../config/multer.config";
import { analyzeLinkedinPdf } from "../controllers/linkedinOptimizer.controller";
import { aiRateLimiter } from "../middlewares/rateLimit.middleware";

const router = express.Router();

// Upload a LinkedIn PDF export and get Gemini analysis
router.post("/analyze-pdf", aiRateLimiter, upload.single("file"), analyzeLinkedinPdf);

export default router;

