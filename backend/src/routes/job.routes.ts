import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
    createJobSchema,
    updateJobSchema,
} from "../validations/job.validation";
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
} from "../controllers/job.controller";
import { objectIdSchema } from "../validations/common.validation";

const router = Router();

// Public: View all jobs
router.get("/", getAllJobs);
router.get("/:id", validate(objectIdSchema), getJobById);

// Protected: Management
router.post(
    "/",
    protect,
    restrictTo("admin", "recruiter"),
    validate(createJobSchema),
    createJob,
);

router.patch(
    "/:id",
    protect,
    restrictTo("admin", "recruiter"),
    validate(objectIdSchema),
    validate(updateJobSchema),
    updateJob,
);

router.delete(
    "/:id",
    protect,
    restrictTo("admin", "recruiter"),
    validate(objectIdSchema),
    deleteJob,
);

export default router;
