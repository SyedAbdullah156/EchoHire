import { Interview } from "../models/interview.model";
import { Job } from "../models/job.model";
import { AppError } from "../utils/AppError.utils";

export const createInterviewService = async (
    job_id: string,
    user_id: string,
    cv_url?: string,
) => {
    // Checking job and its deadline
    const job = await Job.findById(job_id);
    if (!job) {
        throw new AppError("Job not found", 404);
    }
    if (!job.is_active) {
        throw new AppError("This job is no longer accepting applications", 400);
    }
    if (new Date() > job.deadline) {
        throw new AppError("Application deadline has passed", 400);
    }

    // Prevent duplicate applications
    const existingApplication = await Interview.findOne({ job_id, user_id });
    if (existingApplication) {
        throw new AppError("You have already applied for this job", 400);
    }

    // Auto-building rounds from the Job blueprint
    const clonedRounds = job.rounds.map((roundConfig) => ({
        type: roundConfig.type,
        max_questions: roundConfig.max_questions,
        status: "pending",
        qa_pairs: [],
    }));

    // Creating the Interview Instance
    const interview = await Interview.create({
        job_id,
        user_id,
        cv_url,
        status: "applied",
        rounds: clonedRounds,
    });

    return interview;
};


export const getInterviewByIdService = async (interview_id: string) => {
    const interview = await Interview.findById(interview_id)
        .populate("job_id", "name role company_id")
        .populate("user_id", "name email");

    if (!interview) {
        throw new AppError("Interview not found", 404);
    }

    return interview;
};

export const getUserInterviewsService = async (user_id: string) => {
    return await Interview.find({ user_id })
        .populate("job_id", "name role company_id")
        .sort({ createdAt: -1 });
};
