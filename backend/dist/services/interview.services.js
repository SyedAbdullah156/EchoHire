"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInterviewsService = exports.getInterviewByIdService = exports.createInterviewService = void 0;
const interview_model_1 = require("../models/interview.model");
const job_model_1 = require("../models/job.model");
const AppError_utils_1 = require("../utils/AppError.utils");
const createInterviewService = async (job_id, user_id, cv_url) => {
    // Checking job and its deadline
    const job = await job_model_1.Job.findById(job_id);
    if (!job) {
        throw new AppError_utils_1.AppError("Job not found", 404);
    }
    if (!job.is_active) {
        throw new AppError_utils_1.AppError("This job is no longer accepting applications", 400);
    }
    if (new Date() > job.deadline) {
        throw new AppError_utils_1.AppError("Application deadline has passed", 400);
    }
    // Prevent duplicate applications
    const existingApplication = await interview_model_1.Interview.findOne({ job_id, user_id });
    if (existingApplication) {
        throw new AppError_utils_1.AppError("You have already applied for this job", 400);
    }
    // Auto-building rounds from the Job blueprint
    const clonedRounds = job.rounds.map((roundConfig) => ({
        type: roundConfig.type,
        max_questions: roundConfig.max_questions,
        status: "pending",
        qa_pairs: [],
    }));
    // Creating the Interview Instance
    const interview = await interview_model_1.Interview.create({
        job_id,
        user_id,
        cv_url,
        status: "applied",
        rounds: clonedRounds,
    });
    return interview;
};
exports.createInterviewService = createInterviewService;
const getInterviewByIdService = async (interview_id) => {
    const interview = await interview_model_1.Interview.findById(interview_id)
        .populate("job_id", "name role company_id")
        .populate("user_id", "name email");
    if (!interview) {
        throw new AppError_utils_1.AppError("Interview not found", 404);
    }
    return interview;
};
exports.getInterviewByIdService = getInterviewByIdService;
const getUserInterviewsService = async (user_id) => {
    return await interview_model_1.Interview.find({ user_id })
        .populate("job_id", "name role company_id")
        .sort({ createdAt: -1 });
};
exports.getUserInterviewsService = getUserInterviewsService;
