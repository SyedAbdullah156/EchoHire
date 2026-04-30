import { Interview } from "../models/interview.model";
import { Job } from "../models/job.model";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError.utils";
import { v4 as uuidv4 } from "uuid";
import { sendAssessmentLink } from "./email.service";

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

    // ENFORCED LOGIC: 2 AI Interview Rounds + 1 Separate Coding Assessment
    const clonedRounds = [
        {
            type: "BehavioralAnalysis",
            max_questions: 5,
            status: "pending",
            qa_pairs: [],
        },
        {
            type: "TechnicalScreening",
            max_questions: 5,
            status: "pending",
            qa_pairs: [],
        },
        {
            type: "CodingAssessment",
            max_questions: 3,
            status: "pending",
            qa_pairs: [],
        }
    ];

    const assessment_token = uuidv4();
    const join_code = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Creating the Interview Instance
    const interview = await Interview.create({
        job_id,
        user_id,
        cv_url,
        status: "applied",
        rounds: clonedRounds,
        assessment_token,
        join_code,
    });

    // Send Assessment Link via Gmail (Async)
    const user = await User.findById(user_id);
    if (user && user.email) {
        const assessmentLink = `${process.env.FRONTEND_URL}/candidate/coding-test?token=${assessment_token}`;
        sendAssessmentLink(user.email, assessmentLink).catch((err) => {
            console.error("Async Email Error:", err);
        });
    }

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

export const getAllInterviewsService = async (companyId?: string) => {
    let query = {};
    if (companyId) {
        // Find jobs belonging to this company
        const companyJobs = await Job.find({ company_id: companyId }).select("_id");
        const jobIds = companyJobs.map(j => j._id);
        query = { job_id: { $in: jobIds } };
    }

    return await Interview.find(query)
        .populate("job_id", "name role company_id")
        .populate("user_id", "name email")
        .sort({ createdAt: -1 });
};

export const deleteInterviewService = async (id: string) => {
    const result = await Interview.findByIdAndDelete(id);
    if (!result) {
        throw new AppError("Interview not found", 404);
    }
    return true;
};
