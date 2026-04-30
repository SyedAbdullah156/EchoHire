import { Company } from '../models/company.model';
import { TCompany } from '../types/company.types';
import { AppError } from '../utils/apperror.utls';

export const createCompanyService = async (payload: Partial<TCompany>) => {
    return await Company.create(payload);
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

    await company.deleteOne();

    return true;
};
