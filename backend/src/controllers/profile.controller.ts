import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";
import { getUserByIdService, updateUserService } from "../services/user.service";
import { AppError } from "../utils/apperror.utls";
import { updateProfileSchema } from "../validations/profile.validation";

const ALLOWED_PROFILE_FIELDS = [
    "phone",
    "cityCountry",
    "linkedInUrl",
    "githubUrl",
    "portfolioUrl",
    "targetRole",
    "yearsExperience",
    "currentStatus",
    "degree",
    "university",
    "graduationYear",
    "cgpa",
    "coreSkills",
    "preferredIndustry",
    "interviewFocus",
    "careerGoal",
    "avatarDataUrl",
] as const;

const pickAllowedProfileFields = (input: Record<string, unknown>) => {
    return Object.fromEntries(
        Object.entries(input).filter(([key]) => ALLOWED_PROFILE_FIELDS.includes(key as typeof ALLOWED_PROFILE_FIELDS[number]))
    );
};

const parseProfilePayload = (body: unknown) => {
    const parsed = updateProfileSchema.safeParse({ body });

    if (!parsed.success) {
        const message = parsed.error.issues
            .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
            .join(", ");

        throw new AppError(message || "Invalid profile payload", 400);
    }

    return parsed.data.body;
};

export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as string | undefined;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await getUserByIdService(userId);

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const updateMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as string | undefined;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const parsedBody = parseProfilePayload(req.body);
        const incoming = "profile" in parsedBody ? parsedBody.profile : parsedBody;

        const updatePayload: any = {};

        // Map frontend `fullName`/`email` into top-level fields
        if ("fullName" in incoming && incoming.fullName) updatePayload.name = incoming.fullName;
        if ("email" in incoming && incoming.email) updatePayload.email = incoming.email;

        // Keep the rest under `profile`
        const profilePayload = pickAllowedProfileFields({ ...incoming });
        delete profilePayload.fullName;
        delete profilePayload.email;

        updatePayload.profile = profilePayload;

        const user = await updateUserService(userId, updatePayload as any);

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export default {};
