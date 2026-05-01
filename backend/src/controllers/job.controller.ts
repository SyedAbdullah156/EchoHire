import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";
import { Job } from "../models/job.model";
import { Company } from "../models/company.model";
import { AppError } from "../utils/AppError.utils";

export const createJob = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { company_id } = req.body;
        
        // Security Check: Verify user owns the company
        const company = await Company.findById(company_id);
        if (!company) throw new AppError("Company not found", 404);

        if (!req.user) throw new AppError("Authentication required", 401);

        const isAdmin = req.user.role === "admin";
        const isOwner = company.owner_id.toString() === req.user._id!.toString();

        if (!isAdmin && !isOwner) {
            throw new AppError("You do not have permission to post jobs for this company", 403);
        }

        const job = await Job.create(req.body);
        res.status(201).json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

export const getAllJobs = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const jobs = await Job.find({ is_active: true }).populate("company_id", "name logo");
        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        next(error);
    }
};

export const getJobById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const job = await Job.findById(req.params.id).populate("company_id", "name logo");
        if (!job) throw new AppError("Job not found", 404);
        res.status(200).json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

export const updateJob = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const job = await Job.findById(req.params.id).populate("company_id");
        if (!job) throw new AppError("Job not found", 404);

        if (!req.user) throw new AppError("Authentication required", 401);

        // Security Check
        const company = job.company_id as any;
        const isAdmin = req.user.role === "admin";
        const isOwner = company.owner_id.toString() === req.user._id!.toString();

        if (!isAdmin && !isOwner) {
            throw new AppError("Access denied", 403);
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        
        res.status(200).json({ success: true, data: updatedJob });
    } catch (error) {
        next(error);
    }
};

export const deleteJob = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const job = await Job.findById(req.params.id).populate("company_id");
        if (!job) throw new AppError("Job not found", 404);

        if (!req.user) throw new AppError("Authentication required", 401);

        // Security Check
        const company = job.company_id as any;
        const isAdmin = req.user.role === "admin";
        const isOwner = company.owner_id.toString() === req.user._id!.toString();

        if (!isAdmin && !isOwner) {
            throw new AppError("Access denied", 403);
        }

        await job.deleteOne();
        res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        next(error);
    }
};
