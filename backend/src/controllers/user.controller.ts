import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";
import {
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
    updateMyProfileService,
} from "../services/user.service";
import { signAuthToken } from "../utils/auth.utils";

export const getMyProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = await createUserService(req.body);
        const token = signAuthToken({
            ...user,
            _id: String((user as { _id: { toString(): string } })._id),
        });

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

        const user = await updateMyProfileService(req.user._id, req.body);

        res.status(200).json({
            success: true,
            message: "Account created successfully",
            data: user,
            token,
        });
    } catch (error) {
        next(error);
    }
};

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
