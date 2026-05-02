import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";
import * as InterviewService from "../services/interview.services";
import { AppError } from "../utils/AppError.utils";

export const createInterview = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Extract strictly what is allowed from the body
        const { job_id, cv_url } = req.body;

        // Extract user_id from the auth middleware
        const user_id = req.user?._id;

        if (!user_id) {
            throw new AppError("Unauthorized access", 401);
        }

        const interview = await InterviewService.createInterviewService(
            job_id,
            user_id as string,
            cv_url,
        );

        res.status(201).json({
            success: true,
            message:
                "Application submitted and interview initialized successfully",
            data: interview,
        });
    } catch (error) {
        next(error);
    }
};

export const getInterview = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
    
        const interview = await InterviewService.getInterviewByIdService(id as string);
        
        // Security Check: Only Admin or the Candidate who owns this interview can view it
        const isAdmin = req.user.role === "admin";
        const isOwner = interview.user_id._id.toString() === req.user._id!.toString();
        
        if (!isAdmin && !isOwner) {
            throw new AppError("Access denied", 403);
        }
        
        res.status(200).json({
            success: true,
            data: interview,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyInterviews = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user_id = req.user?._id;

        if (!user_id) {
            throw new AppError("Unauthorized access", 401);
        }

        const interviews = await InterviewService.getUserInterviewsService(
            user_id as string,
        );

        res.status(200).json({
            success: true,
            data: interviews,
        });
    } catch (error) {
        next(error);
    }
};
