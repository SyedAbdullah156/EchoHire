import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
    startRound,
    answerInRound,
    voiceAnswer,
    getRound,
} from "../controllers/aiInterview.controller";
import { z } from "zod";
import upload from "../config/multer.config";

const router = Router();

const answerSchema = z.object({
    body: z
        .object({
            content: z
                .string()
                .trim()
                .min(1, "Answer cannot be empty")
                .max(2000, "Answer too long"),
        })
        .strict(),
});

// Using zero-based index for rounds (e.g., /rounds/0/start for Round 1)
router.post("/:interviewId/rounds/:roundIndex/start", protect, startRound);
router.post(
    "/:interviewId/rounds/:roundIndex/answer",
    protect,
    validate(answerSchema),
    answerInRound,
);
router.post(
    "/:interviewId/rounds/:roundIndex/voice-answer",
    protect,
    upload.single("audio"),
    voiceAnswer,
);
router.get("/:interviewId/rounds/:roundIndex", protect, getRound);

export default router;
