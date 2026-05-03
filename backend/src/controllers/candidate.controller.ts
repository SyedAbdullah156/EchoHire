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
            req.body.profile,
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
