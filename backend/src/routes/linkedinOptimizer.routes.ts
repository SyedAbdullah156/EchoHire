import express from "express";
import upload from "../utils/multer.config";
import { analyzeLinkedinPdf } from "../controllers/linkedinOptimizer.controller";

const router = express.Router();

// Upload a LinkedIn PDF export and get Gemini analysis
router.post("/analyze-pdf", upload.single("file"), analyzeLinkedinPdf);

export default router;

