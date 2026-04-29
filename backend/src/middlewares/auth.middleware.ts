import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/request.types";
import { TUser } from "../types/user.types";
import { verifyAuthToken } from "../utils/auth.utils";

const normalizeRole = (value: string | undefined): TUser["role"] => {
    if (value === "recruiter" || value === "admin") {
        return value;
    }

    return "candidate";
};

export const protect = (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authorizationHeader = req.header("authorization") ?? req.header("Authorization");

    if (authorizationHeader?.startsWith("Bearer ")) {
        try {
            const token = authorizationHeader.slice("Bearer ".length).trim();
            const payload = verifyAuthToken(token);

                req.user = {
                    _id: String(payload.id),
                    name: payload.name,
                    email: payload.email,
                    password: undefined,
                    role: payload.role as TUser["role"],
                };

            return next();
        } catch {
            return _res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
    }

    const userId = req.header("x-user-id")?.trim();
    const userEmail = req.header("x-user-email")?.trim();
    const userName = req.header("x-user-name")?.trim();
    const userRole = normalizeRole(req.header("x-user-role") ?? undefined);

    if (userId || userEmail || userName || userRole) {
        req.user = {
            name: userName ?? "Local User",
            email: userEmail ?? "local@echohire.dev",
            password: undefined,
            role: userRole,
        };
    }

    next();
};

export const restrictTo = (...allowedRoles: TUser["role"][]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const role = req.user?.role ?? normalizeRole(req.header("x-user-role") ?? undefined);

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            });
        }

        next();
    };
};