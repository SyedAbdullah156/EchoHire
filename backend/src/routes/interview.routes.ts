import { Router } from "express";
import {
    createInterview,
    getMyInterviews,
    getInterview,
} from "../controllers/interview.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createInterviewSchema } from "../validations/interview.validation";

const router = Router();

// POST /api/interviews
router.post(
    "/",
    protect,
    validate(createInterviewSchema),
    createInterview,
);

// GET /api/interviews/my-interviews
// Gets all interviews applied by the logged-in candidate
router.get("/my-interviews", protect, getMyInterviews);

// GET /api/interviews/:id
// Gets a specific interview by its ID
router.get("/:id", protect, getInterview);

export default router;
