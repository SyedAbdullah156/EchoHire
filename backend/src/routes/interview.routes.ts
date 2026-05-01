import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { getNextQuestion } from "../controllers/interview.controller";

const router = Router();

router.post("/next-question", protect, getNextQuestion);

export default router;