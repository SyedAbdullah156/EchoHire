import { Router } from "express";
import upload from "../config/multer.config";
import { scanResume } from "../controllers/resume.controller";

const router = Router();

// No `protect` needed — the Next.js middleware already ensures only
// authenticated candidates can reach /candidate/* pages which call this API.
router.post("/scan", upload.single("resume"), scanResume);

export default router;
