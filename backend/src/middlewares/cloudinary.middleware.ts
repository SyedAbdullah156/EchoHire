import { Response, NextFunction } from "express";
import { uploadToCloudinary } from "../config/cloudnary.config"; // Adjust path
import { AuthRequest } from "../types/request.types";

export const uploadLogoToCloudinary = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    // 1. If the user didn't upload a logo, just move on to Zod
    if (!req.file) {
        return next();
    }

    try {
        // 2. Send the file Buffer to Cloudinary
        const result = await uploadToCloudinary(
            req.file.buffer,
            "company_logos",
        );

        // 3. Inject the Cloudinary URL into req.body so Zod can see it
        req.body.logo = result.secure_url;

        next();
    } catch (error) {
        next(error);
    }
};