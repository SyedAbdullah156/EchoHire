import { Job } from "../models/job.model";
import { Company } from "../models/company.model";
import { TJob } from "../types/job.types";
import { AppError } from "../utils/AppError.utils";

export const createJobService = async (jobData: any) => {
    // Basic verification that the company exists
    const company = await Company.findById(jobData.company_id);
    if (!company) {
        throw new AppError("Associated company not found", 404);
    }

    return await Job.create(jobData);
};

export const getAllJobsService = async () => {
    return await Job.find({ is_active: true })
        .populate("company_id", "name logo")
        .sort({ createdAt: -1 });
};

export const getJobByIdService = async (id: string) => {
    const job = await Job.findById(id).populate("company_id", "name logo");
    if (!job) {
        throw new AppError("Job not found", 404);
    }
    return job;
};

export const updateJobService = async (
    id: string,
    updateData: Partial<TJob>,
    userId: string,
    role: string,
    userCompanyId?: string,
) => {
    const job = await Job.findById(id).populate("company_id");
    if (!job) {
        throw new AppError("Job not found", 404);
    }

    // Security Check: 
    // 1. Admin can update anything.
    // 2. User must belong to the company that posted the job.
    const jobCompanyId = (job.company_id as any)._id.toString();
    const isAdmin = role === "admin";
    const isMember = userCompanyId === jobCompanyId;

    if (!isAdmin && !isMember) {
        throw new AppError("You do not have permission to update this job", 403);
    }

    return await Job.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
};

export const deleteJobService = async (
    id: string,
    userId: string,
    role: string,
    userCompanyId?: string,
) => {
    const job = await Job.findById(id).populate("company_id");
    if (!job) {
        throw new AppError("Job not found", 404);
    }

    // Security Check
    const jobCompanyId = (job.company_id as any)._id.toString();
    const isAdmin = role === "admin";
    const isMember = userCompanyId === jobCompanyId;

    if (!isAdmin && !isMember) {
        throw new AppError("You do not have permission to delete this job", 403);
    }

    return await job.deleteOne();
};
