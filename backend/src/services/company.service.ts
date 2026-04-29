import { Company } from '../models/company.model';
import { TCompany } from '../types/company.types';
import AppError from '../utils/AppError';

export const createCompanyService = async (payload: TCompany) => {
  return await Company.create(payload);
};

export const getAllCompaniesService = async () => {
  return await Company.find().populate('owner_id', 'name email');
};

export const getCompanyByIdService = async (id: string) => {
  const company = await Company.findById(id);
  if (!company) throw new AppError("Company not found", 404);
  return company;
};

export const updateCompanyService = async (id: string, updateData: Partial<TCompany>) => {
  const company = await Company.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!company) throw new AppError("Company not found", 404);
  return company;
};

export const deleteCompanyService = async (id: string) => {
  const company = await Company.findByIdAndDelete(id);
  if (!company) throw new AppError("Company not found", 404);
  return company;
};