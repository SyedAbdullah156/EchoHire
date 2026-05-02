import { Company } from "../models/company.model";
import { TCompany } from "../types/company.types";
import { AppError } from "../utils/AppError.utils";
import { User } from "../models/user.model";

export const createCompanyService = async (payload: Partial<TCompany>) => {
    const newCompany = await Company.create(payload);

    // Update the User's profile with the new companyId
    await User.findByIdAndUpdate(
        payload.owner_id,
        { 
            $set: { "profile.companyId": newCompany._id }
        }, 
        { new: true, runValidators: false }
    );

    return newCompany;
};

export const getAllCompaniesService = async () => {
    return await Company.find().populate("owner_id", "name email");
};

export const getCompanyByIdService = async (id: string) => {
    const company = await Company.findById(id);

    if (!company) {
        throw new AppError("Company not found", 404);
    }

    return company;
};

export const updateCompanyService = async (
    id: string,
    updateData: Partial<TCompany>,
    userId: string,
    userRole: string,
) => {
    const company = await Company.findById(id);

    if (!company) {
        throw new AppError("Company not found", 404);
    }

    const isOwner = company.owner_id.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
        throw new AppError(
            "You do not have permission to modify this company",
            403,
        );
    }

    const updatedCompany = await Company.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    return updatedCompany;
};

export const deleteCompanyService = async (
    id: string,
    userId: string,
    userRole: string,
) => {
    const company = await Company.findById(id);

    if (!company) {
        throw new AppError("Company not found", 404);
    }

    const isOwner = company.owner_id.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
        throw new AppError(
            "You do not have permission to delete this company",
            403,
        );
    }

    // Delete the company
    await company.deleteOne();

    // Remove the companyId from the User document
    await User.findByIdAndUpdate(
        company.owner_id,
        { 
            $unset: { "profile.companyId": 1 } // Completely removes the field
        }
    );

    return true;
};
