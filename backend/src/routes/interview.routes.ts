import { Router } from "express";
import {
    createInterview,
    getMyInterviews,
    getInterview,
    getAllInterviews,
    deleteInterview,
} from "../controllers/interview.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createInterviewSchema } from "../validations/interview.validation";
import { objectIdSchema } from "../validations/common.validation";

import upload from "../config/multer.config";
import { uploadCvToCloudinary } from "../middlewares/cloudinary.middleware";

const router = Router();

// POST /api/interviews
// Allows a candidate to apply for a job and upload their CV
router.post(
    "/",
    protect,
    restrictTo("candidate"),
    upload.single("cv"), 
    validate(createInterviewSchema), 
    uploadCvToCloudinary, 
    createInterview,
);

// GET /api/interviews
// Admin: Get all interviews in the system
router.get("/", protect, restrictTo("admin"), getAllInterviews);

// GET /api/interviews/my-interviews
// Candidate: Gets all interviews they applied for
router.get("/my-interviews", protect, restrictTo("candidate"), getMyInterviews);

// GET /api/interviews/:id
// Candidate/Recruiter/Admin: Gets a specific interview if they have permission
router.get("/:id", protect, validate(objectIdSchema), getInterview);

// DELETE /api/interviews/:id
// Admin: Delete an interview application
router.delete("/:id", protect, restrictTo("admin"), validate(objectIdSchema), deleteInterview);

export default router;
