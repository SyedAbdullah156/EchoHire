import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";
import { AppError } from "../utils/AppError.utils";
import * as CandidateService from "../services/candidate.services";

export const getMyCandidateProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) {
            throw new AppError("Unauthorized", 401);
        }

        const candidate = await CandidateService.getCandidateByIdService(req.user._id.toString());
        
        res.status(200).json({
            success: true,
            data: candidate,
        });
    } catch (error) {
        next(error);
    }
};

export const updateMyCandidateProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) {
            throw new AppError("Unauthorized", 401);
        }
        const candidate = await CandidateService.updateCandidateProfileService(
            req.user._id.toString(),
            req.body,
        );

        res.status(200).json({
            success: true,
            message: "Candidate profile updated successfully",
            data: candidate,
        });
    } catch (error) {
        next(error);
    }
};

export const updateAvatar = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) throw new AppError("Unauthorized", 401);
        if (!req.body.logo) throw new AppError("No image uploaded", 400);

        const candidate = await CandidateService.updateCandidateProfileService(
            req.user._id.toString(),
            { avatarDataUrl: req.body.logo }
        );

        res.status(200).json({
            success: true,
            message: "Avatar updated successfully",
            url: candidate.profile?.avatarDataUrl
        });
    } catch (error) {
        next(error);
    }
};

export const getAllCandidates = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const candidates = await CandidateService.getAllCandidatesService();
        res.status(200).json({
            success: true,
            data: candidates,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteMyCandidateProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) throw new AppError("Unauthorized", 401);
        await CandidateService.deleteCandidateService(req.user._id.toString());
        res.status(200).json({
            success: true,
            message: "Candidate profile deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCandidateById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        await CandidateService.deleteCandidateService(req.params.id.toString());
        res.status(200).json({
            success: true,
            message: "Candidate profile deleted successfully by Admin",
        });
    } catch (error) {
        next(error);
    }
};
