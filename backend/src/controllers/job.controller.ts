import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";
import * as jobService from "../services/job.services";
import { AppError } from "../utils/AppError.utils";

export const createJob = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user) throw new AppError("Authentication required", 401);

        const jobData = { ...req.body };

        // Logic: For recruiters, we infer the company_id from their profile.
        // For admins, we allow them to pass it in the body.
        if (req.user.role === "recruiter") {
            const companyId = req.user.profile?.companyId;
            if (!companyId) {
                throw new AppError(
                    "Your account is not associated with a company. Please join a company first.",
                    403,
                );
            }
            jobData.company_id = companyId;
        } else if (req.user.role === "admin") {
            if (!jobData.company_id) {
                throw new AppError("Admin must provide a company_id for the job", 400);
            }
        } else {
            throw new AppError("Only recruiters and admins can create jobs", 403);
        }

        const job = await jobService.createJobService(jobData);

        res.status(201).json({
            success: true,
            message: "Job posted successfully",
            data: job,
        });
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
        const jobs = await jobService.getAllJobsService();
        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs,
        });
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
        const job = await jobService.getJobByIdService(req.params.id.toString());
        res.status(200).json({
            success: true,
            data: job,
        });
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
        if (!req.user?._id) throw new AppError("Authentication required", 401);

        const updatedJob = await jobService.updateJobService(
            req.params.id.toString(),
            req.body,
            req.user._id.toString(),
            req.user.role,
            req.user.profile?.companyId?.toString(),
        );

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: updatedJob,
        });
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
        if (!req.user?._id) throw new AppError("Authentication required", 401);

        await jobService.deleteJobService(
            req.params.id.toString(),
            req.user._id.toString(),
            req.user.role,
            req.user.profile?.companyId?.toString(),
        );

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
