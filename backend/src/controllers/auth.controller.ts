import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { AppError } from "../utils/apperror.utls";
import { signAuthToken } from "../utils/auth.utils";
import { createUserService } from "../services/user.service";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await createUserService(req.body);
        const token = signAuthToken({
            ...user,
            _id: String((user as { _id: { toString(): string } })._id),
        });

        res.status(201).json({
            success: true,
            message: "Signup successful",
            data: user,
            token,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };

        if (!email || !password) {
            throw new AppError("Email and password are required", 400);
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

        if (!user || !user.password) {
            throw new AppError("Invalid email or password", 401);
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            throw new AppError("Invalid email or password", 401);
        }

        const userObject = user.toObject();
        delete userObject.password;

        const token = signAuthToken({
            ...userObject,
            _id: String((userObject as { _id: { toString(): string } })._id),
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: userObject,
            token,
        });
    } catch (error) {
        next(error);
    }
};