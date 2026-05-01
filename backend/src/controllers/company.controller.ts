import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";
import * as companyService from "../services/company.services";

export const createCompany = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Compile the data payload from body, file, and user context
        const companyData = {
            ...req.body,
            owner_id: req.user!._id,
        };

        const company = await companyService.createCompanyService(companyData);

        res.status(201).json({ success: true, data: company });
    } catch (error) {
        next(error);
    }
};

export const getAllCompanies = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const companies = await companyService.getAllCompaniesService();

        res.status(200).json({
            success: true,
            count: companies.length,
            data: companies,
        });
    } catch (error) {
        next(error);
    }
};

export const getCompanyById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const company = await companyService.getCompanyByIdService(
            req.params.id as string,
        );

        res.status(200).json({ success: true, data: company });
    } catch (error) {
        next(error);
    }
};

export const updateCompany = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Compile update data including possible new logo
        const updateData = {
            ...req.body,
        };

        const company = await companyService.updateCompanyService(
            req.params.id as string,
            updateData,
            req.user!._id!.toString(),
            req.user!.role,
        );

        res.status(200).json({ success: true, data: company });
    } catch (error) {
        next(error);
    }
};

export const deleteCompany = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        await companyService.deleteCompanyService(
            req.params.id as string,
            req.user!._id!.toString(),
            req.user!.role,
        );

        res.status(200).json({
            success: true,
            message: "Company deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
