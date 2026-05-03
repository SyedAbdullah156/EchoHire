import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";
import {
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
    getPendingRecruitersService,
    approveRecruiterService,
} from "../services/user.services";
import { AppError } from "../utils/AppError.utils";

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const users = await getAllUsersService();
        
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = await getUserByIdService(req.params.id.toString());
        
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) {
            throw new AppError("Unauthorized", 401);
        }

        const user = await getUserByIdService(req.user._id.toString());
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const updateMe = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) {
            throw new AppError("Unauthorized", 401);
        }

        const user = await updateUserService(req.user._id.toString(), req.body);
        
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const updateMyAvatar = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) throw new AppError("Unauthorized", 401);
        if (!req.file) throw new AppError("No file uploaded", 400);

        // Check if cloudinary middleware put it in req.body.logo
        const avatarUrl = req.body.logo || (req.file as any).path || (req.file as any).url;

        if (!avatarUrl) throw new AppError("Failed to process image", 400);

        const user = await updateUserService(req.user._id.toString(), {
            profile: { avatarDataUrl: avatarUrl }
        });

        res.status(200).json({
            success: true,
            url: avatarUrl,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = await updateUserService(req.params.id.toString(), req.body);
        
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await deleteUserService(req.params.id.toString());

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getPendingRecruiters = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const recruiters = await getPendingRecruitersService();
        res.status(200).json({ success: true, data: recruiters });
    } catch (error) {
        next(error);
    }
};

export const approveRecruiter = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = await approveRecruiterService(req.params.id as string);
        res.status(200).json({ success: true, message: "Recruiter approved successfully", data: user });
    } catch (error) {
        next(error);
    }
};