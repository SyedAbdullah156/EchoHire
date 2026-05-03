import { Candidate } from "../models/candidate.model";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError.utils";
import { TCandidateProfile } from "../types/candidate.types";

export const getCandidateByIdService = async (id: string) => {
    const candidate = await Candidate.findById(id).select("-password");
    if (!candidate) {
        throw new AppError("Candidate not found", 404);
    }
    return candidate;
};

export const updateCandidateProfileService = async (
    id: string,
    updateData: any,
) => {
    const updatePayload: Record<string, any> = {};

    if (updateData.name) updatePayload.name = updateData.name;
    
    if (updateData.email) {
        const existingUser = await User.findOne({ email: updateData.email, _id: { $ne: id } });
        if (existingUser) {
            throw new AppError("Email is already in use by another account", 400);
        }
        updatePayload.email = updateData.email;
    }

    if (updateData.profile) {
        Object.entries(updateData.profile).forEach(([key, value]) => {
            updatePayload[`profile.${key}`] = value;
        });
    }

    const candidate = await Candidate.findByIdAndUpdate(
        id,
        { $set: updatePayload },
        { new: true, runValidators: true },
    ).select("-password");

    if (!candidate) {
        throw new AppError("Candidate not found", 404);
    }

    return candidate;
};

export const getAllCandidatesService = async () => {
    return await Candidate.find().select("-password");
};

export const deleteCandidateService = async (id: string) => {
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) {
        throw new AppError("Candidate profile not found", 404);
    }
    return candidate;
};
