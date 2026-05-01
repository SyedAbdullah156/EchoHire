"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.getJobById = exports.getAllJobs = exports.createJob = void 0;
const job_model_1 = require("../models/job.model");
const company_model_1 = require("../models/company.model");
const AppError_utils_1 = require("../utils/AppError.utils");
const createJob = async (req, res, next) => {
    try {
        const { company_id } = req.body;
        // Security Check: Verify user owns the company
        const company = await company_model_1.Company.findById(company_id);
        if (!company)
            throw new AppError_utils_1.AppError("Company not found", 404);
        if (!req.user)
            throw new AppError_utils_1.AppError("Authentication required", 401);
        const isAdmin = req.user.role === "admin";
        const isOwner = company.owner_id.toString() === req.user._id.toString();
        if (!isAdmin && !isOwner) {
            throw new AppError_utils_1.AppError("You do not have permission to post jobs for this company", 403);
        }
        const job = await job_model_1.Job.create(req.body);
        res.status(201).json({ success: true, data: job });
    }
    catch (error) {
        next(error);
    }
};
exports.createJob = createJob;
const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await job_model_1.Job.find({ is_active: true }).populate("company_id", "name logo");
        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllJobs = getAllJobs;
const getJobById = async (req, res, next) => {
    try {
        const job = await job_model_1.Job.findById(req.params.id).populate("company_id", "name logo");
        if (!job)
            throw new AppError_utils_1.AppError("Job not found", 404);
        res.status(200).json({ success: true, data: job });
    }
    catch (error) {
        next(error);
    }
};
exports.getJobById = getJobById;
const updateJob = async (req, res, next) => {
    try {
        const job = await job_model_1.Job.findById(req.params.id).populate("company_id");
        if (!job)
            throw new AppError_utils_1.AppError("Job not found", 404);
        if (!req.user)
            throw new AppError_utils_1.AppError("Authentication required", 401);
        // Security Check
        const company = job.company_id;
        const isAdmin = req.user.role === "admin";
        const isOwner = company.owner_id.toString() === req.user._id.toString();
        if (!isAdmin && !isOwner) {
            throw new AppError_utils_1.AppError("Access denied", 403);
        }
        const updatedJob = await job_model_1.Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, data: updatedJob });
    }
    catch (error) {
        next(error);
    }
};
exports.updateJob = updateJob;
const deleteJob = async (req, res, next) => {
    try {
        const job = await job_model_1.Job.findById(req.params.id).populate("company_id");
        if (!job)
            throw new AppError_utils_1.AppError("Job not found", 404);
        if (!req.user)
            throw new AppError_utils_1.AppError("Authentication required", 401);
        // Security Check
        const company = job.company_id;
        const isAdmin = req.user.role === "admin";
        const isOwner = company.owner_id.toString() === req.user._id.toString();
        if (!isAdmin && !isOwner) {
            throw new AppError_utils_1.AppError("Access denied", 403);
        }
        await job.deleteOne();
        res.status(200).json({ success: true, message: "Job deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteJob = deleteJob;
