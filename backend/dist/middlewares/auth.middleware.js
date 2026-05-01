"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const AppError_utils_1 = require("../utils/AppError.utils");
// Goal: Verify JWT → load user → attach to request
const protect = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        if (!token) {
            return next(new AppError_utils_1.AppError("You are not logged in", 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const currentUser = await user_model_1.User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError_utils_1.AppError("User no longer exists", 401));
        }
        req.user = currentUser;
        next();
    }
    catch (error) {
        next(new AppError_utils_1.AppError("Invalid or expired token", 401));
    }
};
exports.protect = protect;
// Used for restricting roles for users
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError_utils_1.AppError("Unauthorized access", 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError_utils_1.AppError("Permission denied", 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
