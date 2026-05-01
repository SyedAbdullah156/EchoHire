import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
    "JWT_SECRET",
    "MONGODB_URI",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "GEMINI_API_KEY",
    "GEMINI_MODEL",
] as const;

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`${key} is missing in .env`);
    }
});

export const env = {
    JWT_SECRET: process.env.JWT_SECRET!,
    MONGODB_URI: process.env.MONGODB_URI!,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
};