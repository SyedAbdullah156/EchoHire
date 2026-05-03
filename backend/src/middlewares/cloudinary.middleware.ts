import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";

const isCloudinaryConfigured = () => {
    return (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_CLOUD_NAME !== "placeholder" &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_KEY !== "placeholder"
    );
};

export const uploadLogoToCloudinary = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    if (!req.file) {
        return next();
    }

    try {
        if (isCloudinaryConfigured()) {
            // Use Cloudinary when real credentials are present
            const { uploadToCloudinary } = await import("../config/cloudnary.config");
            const result = await uploadToCloudinary(req.file.buffer, "logos");
            req.body.logo = result.secure_url;
        } else {
            // Fallback: convert to Base64 data URL and store directly in DB.
            const mimeType = req.file.mimetype || "image/jpeg";
            const base64 = req.file.buffer.toString("base64");
            req.body.logo = `data:${mimeType};base64,${base64}`;
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const uploadCvToCloudinary = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    if (!req.file) {
        return next();
    }

    try {
        if (isCloudinaryConfigured()) {
            const { uploadToCloudinary } = await import("../config/cloudnary.config");
            // Upload to 'resumes' folder
            const result = await uploadToCloudinary(req.file.buffer, "resumes");
            req.body.cv_url = result.secure_url;
        } else {
            // Fallback for CVs: Store as base64 PDF string
            const mimeType = req.file.mimetype || "application/pdf";
            const base64 = req.file.buffer.toString("base64");
            req.body.cv_url = `data:${mimeType};base64,${base64}`;
        }

        next();
    } catch (error) {
        next(error);
    }
};