import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { TUser } from "../types/user.types";
import { AppError } from "../utils/apperror.utls";
import bcrypt from "bcryptjs";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const createUserService = async (userData: TUser) => {
    // Check if user already exists to prevent duplicate errors from MongoDB
    const email = normalizeEmail(userData.email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("Email is already registered", 400);
    }

    const hashedPassword = userData.password
        ? await bcrypt.hash(userData.password, 10)
        : undefined;
    
    const user = await User.create({
        ...userData,
        email,
        password: hashedPassword,
    });

    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

export const getAllUsersService = async () => {
    return await User.find().select("-password");
};

export const getUserByIdService = async (id: string) => {
    const user = await User.findById(id).select("-password");
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return user;
};

export const getUserByEmailService = async (email: string) => {
    const user = await User.findOne({ email: normalizeEmail(email) }).select('-password');
    if (!user) {
        throw new AppError("No user found with this email", 404);
    }
    return user;
};

export const updateUserService = async (id: string, updateData: Partial<TUser>) => {
    const updatePayload = {
        ...updateData,
        ...(updateData.email ? { email: normalizeEmail(updateData.email) } : {}),
    };

    if (updatePayload.email) {
        const existingUser = await User.findOne({
            email: updatePayload.email,
            _id: { $ne: id },
        });

        if (existingUser) {
            throw new AppError("Email is already registered", 400);
        }
    }

    if (updatePayload.password) {
        updatePayload.password = await bcrypt.hash(updatePayload.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
    }).select("-password");

    const updatePayload: Record<string, any> = {};

    // top-level fields
    if (name) updatePayload.name = name;
    if (email) updatePayload.email = email;

    // nested profile fields (SAFE)
    if (profile) {
        for (const [key, value] of Object.entries(profile)) {
            updatePayload[`profile.${key}`] = value;
        }
    }
    console.log(updatePayload);
    
    const user = await User.findByIdAndUpdate(
        id,
        { $set: updatePayload },
        { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
};

export const deleteUserService = async (id: string) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return user;
};
