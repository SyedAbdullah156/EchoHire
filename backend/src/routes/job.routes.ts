import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
    createJobSchema,
    updateJobSchema,
    jobParamsSchema,
} from "../validations/job.validation";
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
} from "../controllers/job.controller";

const router = Router();

// Public: View all jobs
router.get("/", getAllJobs);
router.get("/:id", validate(jobParamsSchema), getJobById);

// Protected: Management
router.post(
    "/",
    protect,
    restrictTo("admin", "company"),
    validate(createJobSchema),
    createJob,
);

router.put(
    "/:id",
    protect,
    restrictTo("admin", "company"),
    validate(jobParamsSchema),
    validate(updateJobSchema),
    updateJob,
);

router.delete(
    "/:id",
    protect,
    restrictTo("admin", "company"),
    validate(jobParamsSchema),
    deleteJob,
);

export default router;
