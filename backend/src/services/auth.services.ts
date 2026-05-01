import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError.utils";
import { signToken } from "../utils/jwt.utils";
import { createUserService } from "./user.services";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = await createUserService(req.body);
        const token = signToken(user._id.toString(), user.role);

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

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email, password } = req.body as {
            email?: string;
            password?: string;
        };

        if (!email || !password) {
            throw new AppError("Email and password are required", 400);
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select("+password");

        if (!user || !user.password) {
            throw new AppError("Invalid email or password", 401);
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            throw new AppError("Invalid email or password", 401);
        }

        const userObject = user.toObject();
        delete userObject.password;

        const token = signToken(user._id.toString(), user.role);

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

export const googleLogin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { credential, role } = req.body;

        if (!credential) {
            throw new AppError("Google credential is required", 400);
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new AppError("Invalid Google token", 400);
        }

        let user = await User.findOne({ email: payload.email.toLowerCase() });

        if (!user) {
            // Auto-register
            const newUser = await createUserService({
                name: payload.name || "Google User",
                email: payload.email,
                role: (role as "candidate" | "recruiter" | "admin") || "candidate",
            });
            user = await User.findById(newUser._id);
            if (user) {
                user.googleId = payload.sub;
                await user.save();
            }
        } else if (!user.googleId) {
            user.googleId = payload.sub;
            await user.save();
        }

        if (!user || !user._id) {
            throw new AppError("User creation failed", 500);
        }

        const userObject = user.toObject();
        delete userObject.password;

        const token = signToken(user._id.toString(), user.role);

        res.status(200).json({
            success: true,
            message: "Google login successful",
            data: userObject,
            token,
        });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email } = req.body;
        if (!email) throw new AppError("Email is required", 400);

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            // Return 200 even if not found to prevent email enumeration
            return res.status(200).json({ success: true, message: "If that email exists, a reset link was sent." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

        try {
            await transporter.sendMail({
                from: process.env.SMTP_FROM || "noreply@echohire.com",
                to: user.email,
                subject: "EchoHire - Password Reset",
                text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
                html: `<p>You requested a password reset.</p><p>Click the link to reset your password: <a href="${resetUrl}">Reset Password</a></p><p>This link expires in 10 minutes.</p>`,
            });

            res.status(200).json({ success: true, message: "Reset link sent to email." });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            throw new AppError("Failed to send reset email", 500);
        }
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) throw new AppError("Token and password are required", 400);

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            throw new AppError("Token is invalid or has expired", 400);
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        next(error);
    }
};
