import { Request, Response, NextFunction } from "express";
import {
    createUserService,
    getAllUsersService,
    getUserByIdService,
    getUserByEmailService,
    updateUserService,
    deleteUserService,
} from "../services/user.service";

// CREATE USER
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);
        const user = await createUserService(req.body);

        res.status(201).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// GET ALL USERS
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
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

// GET USER BY ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserByIdService(req.params.id as string);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// GET USER BY EMAIL
export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserByEmailService(req.params.email as string);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE USER
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await updateUserService(req.params.id as string, req.body);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE USER
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await deleteUserService(req.params.id as string);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};