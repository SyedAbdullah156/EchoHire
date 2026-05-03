import { Candidate } from "../models/candidate.model";
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
    profileData: Partial<TCandidateProfile>,
) => {
    const updatePayload: Record<string, any> = {};

    if (profileData) {
        Object.entries(profileData).forEach(([key, value]) => {
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
