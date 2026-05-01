"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompanyService = exports.updateCompanyService = exports.getCompanyByIdService = exports.getAllCompaniesService = exports.createCompanyService = void 0;
const company_model_1 = require("../models/company.model");
const AppError_utils_1 = require("../utils/AppError.utils");
const createCompanyService = async (payload) => {
    return await company_model_1.Company.create(payload);
};
exports.createCompanyService = createCompanyService;
const getAllCompaniesService = async () => {
    return await company_model_1.Company.find().populate("owner_id", "name email");
};
exports.getAllCompaniesService = getAllCompaniesService;
const getCompanyByIdService = async (id) => {
    const company = await company_model_1.Company.findById(id);
    if (!company) {
        throw new AppError_utils_1.AppError("Company not found", 404);
    }
    return company;
};
exports.getCompanyByIdService = getCompanyByIdService;
const updateCompanyService = async (id, updateData, userId, userRole) => {
    const company = await company_model_1.Company.findById(id);
    if (!company) {
        throw new AppError_utils_1.AppError("Company not found", 404);
    }
    const isOwner = company.owner_id.toString() === userId.toString();
    const isAdmin = userRole === "admin";
    if (!isOwner && !isAdmin) {
        throw new AppError_utils_1.AppError("You do not have permission to modify this company", 403);
    }
    const updatedCompany = await company_model_1.Company.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
    return updatedCompany;
};
exports.updateCompanyService = updateCompanyService;
const deleteCompanyService = async (id, userId, userRole) => {
    const company = await company_model_1.Company.findById(id);
    if (!company) {
        throw new AppError_utils_1.AppError("Company not found", 404);
    }
    const isOwner = company.owner_id.toString() === userId.toString();
    const isAdmin = userRole === "admin";
    if (!isOwner && !isAdmin) {
        throw new AppError_utils_1.AppError("You do not have permission to delete this company", 403);
    }
    await company.deleteOne();
    return true;
};
exports.deleteCompanyService = deleteCompanyService;
