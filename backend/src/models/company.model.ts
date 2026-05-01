import mongoose, { Schema } from "mongoose";
import { TCompany } from "../types/company.types";
import { COMPANY_LIMITS } from "../constants/company.constants";

const companySchema = new Schema<TCompany>(
    {
        name: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
            minlength: [
                COMPANY_LIMITS.NAME_MIN,
                `Name must be at least ${COMPANY_LIMITS.NAME_MIN} characters`,
            ],
            maxlength: [
                COMPANY_LIMITS.NAME_MAX,
                `Name cannot exceed ${COMPANY_LIMITS.NAME_MAX} characters`,
            ],
        },
        description: {
            type: String,
            required: false,
            trim: true,
            minlength: [
                COMPANY_LIMITS.DESCRIPTION_MIN,
                `Description must be at least ${COMPANY_LIMITS.DESCRIPTION_MIN} characters`,
            ],
            maxlength: [
                COMPANY_LIMITS.DESCRIPTION_MAX,
                `Description cannot exceed ${COMPANY_LIMITS.DESCRIPTION_MAX} characters`,
            ],
        },
        website: {
            type: String,
            required: false,
            trim: true,
        },
        logo: {
            type: String,
            required: false,
            default: "https://placehold.co/400x400?text=Company+Logo",
        },
        owner_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "A company must be linked to an owner (user)"],
        },
    },
    { timestamps: true },
);

export const Company = mongoose.model<TCompany>("Company", companySchema);
