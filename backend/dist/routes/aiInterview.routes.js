"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const aiInterview_controller_1 = require("../controllers/aiInterview.controller");
const zod_1 = require("zod");
const multer_config_1 = __importDefault(require("../config/multer.config"));
const router = (0, express_1.Router)();
const answerSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        content: zod_1.z
            .string()
            .trim()
            .min(1, "Answer cannot be empty")
            .max(2000, "Answer too long"),
    })
        .strict(),
});
// Using zero-based index for rounds (e.g., /rounds/0/start for Round 1)
router.post("/:interviewId/rounds/:roundIndex/start", auth_middleware_1.protect, aiInterview_controller_1.startRound);
router.post("/:interviewId/rounds/:roundIndex/answer", auth_middleware_1.protect, (0, validate_middleware_1.validate)(answerSchema), aiInterview_controller_1.answerInRound);
router.post("/:interviewId/rounds/:roundIndex/voice-answer", auth_middleware_1.protect, multer_config_1.default.single("audio"), aiInterview_controller_1.voiceAnswer);
router.get("/:interviewId/rounds/:roundIndex", auth_middleware_1.protect, aiInterview_controller_1.getRound);
exports.default = router;
