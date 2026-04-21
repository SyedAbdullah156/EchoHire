import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/apperror.utls";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = { ...err };
    error.message = err.message;

    // OPTIMIZATION: Catch specific MongoDB/Mongoose errors
    if (err.name === 'CastError') error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
    if (err.code === 11000) error = new AppError("Duplicate field value entered", 400);
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val: any) => val.message);
        error = new AppError(`Invalid input data: ${message.join('. ')}`, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        // Business Practice: Only reveal technical details in development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};