import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
    startRound,
    answerInRound,
    answerInRoundStreaming,
    voiceAnswer,
    getRound,
} from "../controllers/aiInterview.controller";
import { z } from "zod";
import upload from "../config/multer.config";
import { interviewRoundParamsSchema } from "../validations/interview.validation";

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

router.post(
    "/:interviewId/rounds/:roundIndex/start", 
    protect, 
    validate(interviewRoundParamsSchema),
    startRound
);

router.post(
    "/:interviewId/rounds/:roundIndex/answer",
    protect,
    validate(interviewRoundParamsSchema),
    validate(answerSchema),
    answerInRound,
);

router.post(
    "/:id/rounds/:roundIndex/answer-stream",
    protect,
    answerInRoundStreaming,
);

router.post(
    "/:interviewId/rounds/:roundIndex/voice-answer",
    protect,
    validate(interviewRoundParamsSchema),
    upload.single("audio"),
    voiceAnswer,
);

router.get(
    "/:interviewId/rounds/:roundIndex", 
    protect, 
    validate(interviewRoundParamsSchema),
    getRound
);

export default router;