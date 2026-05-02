import { Router } from "express";
import {
    createInterview,
    getMyInterviews,
    getInterview,
} from "../controllers/interview.controller";
import { protect } from "../middlewares/auth.middleware";
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
    upload.single("cv"), // Handle the PDF file upload
    validate(createInterviewSchema), // verifies before upload
    uploadCvToCloudinary, // Upload the file to Cloudinary and set req.body.cv_url
    createInterview,
);

// GET /api/interviews/my-interviews
// Gets all interviews applied by the logged-in candidate
router.get("/my-interviews", protect, getMyInterviews);

// GET /api/interviews/:id
// Gets a specific interview by its ID
router.get("/:id", protect, validate(objectIdSchema), getInterview);

export default router;
