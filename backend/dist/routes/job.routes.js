"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const job_validation_1 = require("../validations/job.validation");
const job_controller_1 = require("../controllers/job.controller");
const router = (0, express_1.Router)();
// Public: View all jobs
router.get("/", job_controller_1.getAllJobs);
router.get("/:id", (0, validate_middleware_1.validate)(job_validation_1.jobParamsSchema), job_controller_1.getJobById);
// Protected: Management
router.post("/", auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("admin", "company"), (0, validate_middleware_1.validate)(job_validation_1.createJobSchema), job_controller_1.createJob);
router.put("/:id", auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("admin", "company"), (0, validate_middleware_1.validate)(job_validation_1.jobParamsSchema), (0, validate_middleware_1.validate)(job_validation_1.updateJobSchema), job_controller_1.updateJob);
router.delete("/:id", auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("admin", "company"), (0, validate_middleware_1.validate)(job_validation_1.jobParamsSchema), job_controller_1.deleteJob);
exports.default = router;
