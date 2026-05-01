"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserService = exports.updateUserService = exports.getUserByIdService = exports.getAllUsersService = exports.createUserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const AppError_utils_1 = require("../utils/AppError.utils");
const createUserService = async (userData) => {
    const existingUser = await user_model_1.User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError_utils_1.AppError("Email is already registered", 400);
    }
    const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
    const user = await user_model_1.User.create({
        ...userData,
        password: hashedPassword,
    });
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
};
exports.createUserService = createUserService;
const getAllUsersService = async () => {
    return await user_model_1.User.find().select("-password");
};
exports.getAllUsersService = getAllUsersService;
const getUserByIdService = async (id) => {
    const user = await user_model_1.User.findById(id).select("-password");
    if (!user) {
        throw new AppError_utils_1.AppError("User not found", 404);
    }
    return user;
};
exports.getUserByIdService = getUserByIdService;
const updateUserService = async (id, inputData) => {
    const { name, email, profile } = inputData;
    // If email is being changed, check for duplicates
    // If same email as before → passes (since it excludes self)
    if (email) {
        const existingUser = await user_model_1.User.findOne({ email, _id: { $ne: id } });
        if (existingUser) {
            throw new AppError_utils_1.AppError("Email is already in use by another account", 400);
        }
    }
    const updatePayload = {};
    if (name)
        updatePayload.name = name;
    if (email)
        updatePayload.email = email;
    // Map nested profile fields to dot notation for atomic updates
    if (profile) {
        Object.entries(profile).forEach(([key, value]) => {
            updatePayload[`profile.${key}`] = value;
        });
    }
    const user = await user_model_1.User.findByIdAndUpdate(id, { $set: updatePayload }, { new: true, runValidators: true }).select("-password");
    if (!user) {
        throw new AppError_utils_1.AppError("User not found", 404);
    }
    return user;
};
exports.updateUserService = updateUserService;
const deleteUserService = async (id) => {
    const user = await user_model_1.User.findByIdAndDelete(id);
    if (!user) {
        throw new AppError_utils_1.AppError("User not found", 404);
    }
    return user;
};
exports.deleteUserService = deleteUserService;
