import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
}

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in .env");
}

export const ENV = {
    JWT_SECRET: process.env.JWT_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
};
