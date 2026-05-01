"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = [];
    // Checking if Mongoose Validation Error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Failed";
        errors = Object.values(err.errors).map((el) => el.message);
    }
    res.status(statusCode).json({
        success: false,
        message: message,
        errors: errors.length > 0 ? errors : undefined, // Only send errors if they exist
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.globalErrorHandler = globalErrorHandler;
