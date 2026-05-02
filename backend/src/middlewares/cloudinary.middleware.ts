import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";

const CLOUDINARY_CONFIGURED =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== "placeholder" &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== "placeholder";

export const uploadLogoToCloudinary = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    if (!req.file) {
        return next();
    }

    try {
        if (CLOUDINARY_CONFIGURED) {
            // Use Cloudinary when real credentials are present
            const { uploadToCloudinary } = await import("../config/cloudnary.config");
            const result = await uploadToCloudinary(req.file.buffer, "logos");
            req.body.logo = result.secure_url;
        } else {
            // Fallback: convert to Base64 data URL and store directly in DB.
            // This works perfectly with the existing `avatarDataUrl` field.
            const mimeType = req.file.mimetype || "image/jpeg";
            const base64 = req.file.buffer.toString("base64");
            req.body.logo = `data:${mimeType};base64,${base64}`;
        }

        next();
    } catch (error) {
        next(error);
    }
};