"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const AppError_utils_1 = require("../utils/AppError.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const user_services_1 = require("./user.services");
const register = async (req, res, next) => {
    try {
        const user = await (0, user_services_1.createUserService)(req.body);
        const token = (0, jwt_utils_1.signToken)(user._id.toString(), user.role);
        res.status(201).json({
            success: true,
            message: "Signup successful",
            data: user,
            token,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new AppError_utils_1.AppError("Email and password are required", 400);
        }
        const user = await user_model_1.User.findOne({
            email: email.trim().toLowerCase(),
        }).select("+password");
        if (!user || !user.password) {
            throw new AppError_utils_1.AppError("Invalid email or password", 401);
        }
        const passwordMatches = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatches) {
            throw new AppError_utils_1.AppError("Invalid email or password", 401);
        }
        const userObject = user.toObject();
        delete userObject.password;
        const token = (0, jwt_utils_1.signToken)(user._id.toString(), user.role);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: userObject,
            token,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
