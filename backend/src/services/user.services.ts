import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { TProfile, TUser } from "../types/user.types";
import { AppError } from "../utils/AppError.utils";

type CreateUserInput = Omit<TUser, "_id">;

export const createUserService = async (userData: CreateUserInput) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError("Email is already registered", 400);
    }

    let hashedPassword;
    if (userData.password) {
        hashedPassword = await bcrypt.hash(userData.password, 10);
    }

    const user = await User.create({
        ...userData,
        ...(hashedPassword && { password: hashedPassword }),
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

export const updateUserService = async (id: string, inputData: Partial<TUser>) => {
    const { name, email, profile } = inputData;

    // If email is being changed, check for duplicates
    // If same email as before → passes (since it excludes self)
    if (email) {
        const existingUser = await User.findOne({ email, _id: { $ne: id } });
        if (existingUser) {
            throw new AppError(
                "Email is already in use by another account",
                400,
            );
        }
    }

    const updatePayload: Record<string, any> = {};
    if (name) updatePayload.name = name;
    if (email) updatePayload.email = email;

    // Map nested profile fields to dot notation for atomic updates
    if (profile) {
        Object.entries(profile).forEach(([key, value]) => {
            updatePayload[`profile.${key}`] = value;
        });
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
