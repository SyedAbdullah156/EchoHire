import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { TProfile, TUser } from "../types/user.types";
import { AppError } from "../utils/AppError.utils";

type CreateUserInput = Omit<TUser, "_id" | "password"> & {
    password: string;
};

export const createUserService = async (userData: CreateUserInput) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError("Email is already registered", 400);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create({
        ...userData,
        password: hashedPassword,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return userObj;
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

export const updateUserService = async (id: string, inputData: any) => {
    const { name, email, profile } = inputData;

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