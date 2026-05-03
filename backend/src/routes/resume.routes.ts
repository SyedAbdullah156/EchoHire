import { Router } from "express";
import upload from "../config/multer.config";
import { scanResume } from "../controllers/resume.controller";
import { aiRateLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

// No `protect` needed — the Next.js middleware already ensures only
// authenticated candidates can reach /candidate/* pages which call this API.
router.post("/scan", aiRateLimiter, upload.single("resume"), scanResume);

export default router;
