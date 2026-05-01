import { Response, NextFunction } from "express";
import { uploadToCloudinary } from "../config/cloudnary.config"; // Adjust path
import { AuthRequest } from "../types/request.types";

export const uploadLogoToCloudinary = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => { 
    if (!req.file) { // If the user didn't upload a logo, just move on to Zod
        return next();
    }

    try {
        const result = await uploadToCloudinary(req.file.buffer, "logos"); // Send the file Buffer to Cloudinary
        req.body.logo = result.secure_url; // Add the new URL to the body
        next();
    } catch (error) {
        next(error);
    }
};