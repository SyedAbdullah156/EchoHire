import { User } from "../models/user.model";
import { TUser } from "../types/user.types";
import { AppError } from "../utils/apperror.utls";

export const createUserService = async (userData: TUser) => {
    // Check if user already exists to prevent duplicate errors from MongoDB
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError("Email is already registered", 400);
    }
    
    const user = await User.create(userData);
    return user;
};

export const getAllUsersService = async () => {
    // .select('-password') ensures we never accidentally send hashes to the client
    const users = await User.find().select('-password');
    return users;
};

export const getUserByIdService = async (id: string) => {
    const user = await User.findById(id).select('-password'); // We already did select: false in schema so here it is redundant but good practice
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return user;
};

export const getUserByEmailService = async (email: string) => {
    const user = await User.findOne({ email }).select('-password');
    if (!user) {
        throw new AppError("No user found with this email", 404);
    }
    return user;
};

export const updateUserService = async (id: string, updateData: Partial<TUser>) => {
    const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    }).select('-password');

    if (!user) {
        throw new AppError("User not found to update", 404);
    }
    return user;
};

export const deleteUserService = async (id: string) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new AppError("User not found to delete", 404);
    }
    return user;
};