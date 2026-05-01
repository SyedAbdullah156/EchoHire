import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import upload from "../config/multer.config";
import { scanResume } from "../controllers/resume.controller";

const router = Router();

router.post("/scan", protect, upload.single("resume"), scanResume);

export default router;
