"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateAvatar = exports.updateUser = exports.updateMyProfile = exports.getMyProfile = exports.getUserById = exports.getAllUsers = void 0;
const user_services_1 = require("../services/user.services");
const AppError_utils_1 = require("../utils/AppError.utils");
const getNormalizedParamId = (id) => {
    if (Array.isArray(id)) {
        return id[0] ?? "";
    }
    return id ?? "";
};
const getAllUsers = async (req, res, next) => {
    try {
        const users = await (0, user_services_1.getAllUsersService)();
        res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res, next) => {
    try {
        const userId = getNormalizedParamId(req.params.id);
        if (!userId) {
            throw new AppError_utils_1.AppError("User id is required", 400);
        }
        const user = await (0, user_services_1.getUserByIdService)(userId);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
const getMyProfile = async (req, res, next) => {
    try {
        if (!req.user?._id) {
            throw new AppError_utils_1.AppError("Unauthorized", 401);
        }
        const user = await (0, user_services_1.getUserByIdService)(req.user._id);
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyProfile = getMyProfile;
const updateMyProfile = async (req, res, next) => {
    try {
        if (!req.user?._id) {
            throw new AppError_utils_1.AppError("Unauthorized", 401);
        }
        const user = await (0, user_services_1.updateUserService)(req.user._id, req.body);
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateMyProfile = updateMyProfile;
const updateUser = async (req, res, next) => {
    try {
        const userId = getNormalizedParamId(req.params.id);
        if (!userId) {
            throw new AppError_utils_1.AppError("User id is required", 400);
        }
        const user = await (0, user_services_1.updateUserService)(userId, req.body);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const updateAvatar = async (req, res, next) => {
    try {
        if (!req.user)
            throw new AppError_utils_1.AppError("Unauthorized", 401);
        if (!req.body.logo)
            throw new AppError_utils_1.AppError("No image uploaded", 400);
        const user = await (0, user_services_1.updateUserService)(req.user._id, {
            profile: { avatarDataUrl: req.body.logo }
        });
        res.status(200).json({
            success: true,
            message: "Avatar updated successfully",
            url: user.profile?.avatarDataUrl
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateAvatar = updateAvatar;
const deleteUser = async (req, res, next) => {
    try {
        const userId = getNormalizedParamId(req.params.id);
        if (!userId) {
            throw new AppError_utils_1.AppError("User id is required", 400);
        }
        const result = await (0, user_services_1.deleteUserService)(userId);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
