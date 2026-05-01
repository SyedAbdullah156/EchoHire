"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interview_controller_1 = require("../controllers/interview.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const interview_validation_1 = require("../validations/interview.validation");
const router = (0, express_1.Router)();
// POST /api/interviews
router.post("/", auth_middleware_1.protect, (0, validate_middleware_1.validate)(interview_validation_1.createInterviewSchema), interview_controller_1.createInterview);
// GET /api/interviews/my-interviews
// Gets all interviews applied by the logged-in candidate
router.get("/my-interviews", auth_middleware_1.protect, interview_controller_1.getMyInterviews);
// GET /api/interviews/:id
// Gets a specific interview by its ID
router.get("/:id", auth_middleware_1.protect, interview_controller_1.getInterview);
exports.default = router;
