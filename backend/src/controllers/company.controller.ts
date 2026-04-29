import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/request.types';
import { createCompanyService, deleteCompanyService, getAllCompaniesService, getCompanyByIdService, updateCompanyService } from '../services/company.service';
import { AppError } from '../utils/apperror.utls';

const getUploadedLogoPath = (file?: Express.Multer.File) => {
    return file ? `/uploads/${file.filename}` : undefined;
};

export const createCompany = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const ownerId = req.body.owner_id ?? req.header('x-user-id');

        if (!ownerId) {
            throw new AppError('owner_id is required to create a company', 400);
        }

        const company = await createCompanyService({
            ...req.body,
            owner_id: ownerId,
            logo: getUploadedLogoPath(req.file) ?? req.body.logo,
        });

        res.status(201).json({
            success: true,
            data: company,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllCompanies = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const companies = await getAllCompaniesService();

        res.status(200).json({
            success: true,
            data: companies,
        });
    } catch (error) {
        next(error);
    }
};

export const getCompanyById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const company = await getCompanyByIdService(req.params.id as string);

        res.status(200).json({
            success: true,
            data: company,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCompany = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const updateData = {
            ...req.body,
            ...(req.file ? { logo: getUploadedLogoPath(req.file) } : {}),
        };

        const company = await updateCompanyService(req.params.id as string, updateData);

        res.status(200).json({
            success: true,
            data: company,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCompany = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const company = await deleteCompanyService(req.params.id as string);

        res.status(200).json({
            success: true,
            message: 'Company deleted successfully',
            data: company,
        });
    } catch (error) {
        next(error);
    }
};