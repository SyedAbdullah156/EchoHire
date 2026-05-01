import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { AuthRequest } from "../types/request.types";
import { AppError } from "../utils/AppError.utils";

interface CustomJwtPayload {
    id: string;
}

// Goal: Verify JWT → load user → attach to request
export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        let token: string | undefined;

        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return next(new AppError("You are not logged in", 401));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string,
        ) as CustomJwtPayload;

        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return next(new AppError("User no longer exists", 401));
        }

        req.user = currentUser;

        next();
    } catch (error) {
        next(new AppError("Invalid or expired token", 401));
    }
};

// Used for restricting roles for users
export const restrictTo = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError("Unauthorized access", 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError("Permission denied", 403));
        }

        next();
    };
};
