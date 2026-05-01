"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLogoToCloudinary = void 0;
const cloudnary_config_1 = require("../config/cloudnary.config"); // Adjust path
const uploadLogoToCloudinary = async (req, res, next) => {
    if (!req.file) { // If the user didn't upload a logo, just move on to Zod
        return next();
    }
    try {
        const result = await (0, cloudnary_config_1.uploadToCloudinary)(req.file.buffer, "logos"); // Send the file Buffer to Cloudinary
        req.body.logo = result.secure_url; // Add the new URL to the body
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.uploadLogoToCloudinary = uploadLogoToCloudinary;
