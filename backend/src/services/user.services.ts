import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { TUser } from "../types/user.types";
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
    const { name, email } = inputData;

    if (email) {
        const existingUser = await User.findOne({ email, _id: { $ne: id } });
        if (existingUser) {
            throw new AppError(
                "Email is already in use by another account",
                400,
            );
        }
    }

    // Only Email and Passwords can be updated using User Service
    const updatePayload: Record<string, any> = {};
    if (name) updatePayload.name = name;
    if (email) updatePayload.email = email;

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
