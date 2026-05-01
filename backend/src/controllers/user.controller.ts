import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";
import {
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
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
        const user = await getUserByIdService(req.params.id);
        
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

        const user = await getUserByIdService(req.user._id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const updateMyProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) {
            throw new AppError("Unauthorized", 401);
        }

        const user = await updateUserService(req.user._id, req.body);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
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
        const user = await updateUserService(req.params.id, req.body);
        
        res.status(200).json({
            success: true,
            data: user,
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
        if (!req.user) throw new AppError("Unauthorized", 401);
        if (!req.body.logo) throw new AppError("No image uploaded", 400);

        const user = await updateUserService(req.user._id!, {
            profile: { avatarDataUrl: req.body.logo }
        });

        res.status(200).json({
            success: true,
            message: "Avatar updated successfully",
            url: user.profile?.avatarDataUrl
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
        const result = await deleteUserService(req.params.id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};