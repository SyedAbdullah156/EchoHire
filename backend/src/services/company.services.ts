import { Company } from "../models/company.model";
import { TCompany } from "../types/company.types";
import { AppError } from "../utils/AppError.utils";
import { User } from "../models/user.model";
import { Employee } from "../models/employee.model";

export const createCompanyService = async (payload: Partial<TCompany>) => {
    const newCompany = await Company.create(payload);

    // Update the User's profile with the new company_id (for Recruiters/Employees)
    await User.findByIdAndUpdate(
        payload.owner_id,
        { 
            $set: { company_id: newCompany._id }
        }, 
        { new: true, runValidators: false, strict: false }
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
    updateData: Partial<TCompany>,
    userId: string,
) => {
    const user = await Employee.findById(userId);
    if (!user || !user.company_id) {
        throw new AppError("You do not own a company profile to update.", 401);
    }

    const companyId = user.company_id.toString();
    const updatedCompany = await Company.findByIdAndUpdate(companyId, updateData, {
        new: true,
        runValidators: true,
    });

    if (!updatedCompany) {
        throw new AppError("Company not found", 404);
    }

    return updatedCompany;
};

export const deleteCompanyService = async (
    userId: string,
) => {
    if (!userId){
        throw new AppError("Unauthorized", 401);
    }

    const user = await Employee.findById(userId);
    if (!user || !user.company_id) {
        throw new AppError("You do not own a company profile to delete.", 401);
    }

    const company = await Company.findById(user.company_id);

    if (!company) {
        throw new AppError("Company not found", 404);
    }

    // Delete the company
    await company.deleteOne();

    // Remove the company_id from the User document
    await User.findByIdAndUpdate(
        company.owner_id,
        { 
            $unset: { company_id: 1 } // Completely removes the field
        },
        { strict: false }
    );

    return true;
};

export const deleteCompanyByIdService = async (id: string) => {
    const company = await Company.findById(id);

    if (!company) {
        throw new AppError("Company not found", 404);
    }

    const ownerId = company.owner_id;

    // Delete the company
    await company.deleteOne();

    // Remove the company_id from the Owner's document
    await User.findByIdAndUpdate(
        ownerId,
        { 
            $unset: { company_id: 1 } 
        },
        { strict: false }
    );

    return true;
};
