import { NextFunction, Request, Response } from "express";
import * as EmployeeService from "../services/employee.services";
import { AuthRequest } from "../types/request.types";
import { AppError } from "../utils/AppError.utils";

export const createEmployee = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) {
            throw new AppError("Unauthorized access", 401);
        }
        const userId = req.user._id.toString();
        const employee = await EmployeeService.createEmployeeService({ ...req.body, _id: userId });

        res.status(201).json({
            success: true,
            message: "Employee profile created successfully",
            data: employee,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyEmployeeProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) {
            throw new AppError("Unauthorized access", 401);
        }
        const userId = req.user._id.toString();
        const employee = await EmployeeService.getEmployeeByIdService(userId);

        res.status(200).json({
            success: true,
            message: "Employee profile retrieved successfully",
            data: employee,
        });
    } catch (error) {
        next(error);
    }
};

export const updateMyEmployeeProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) {
            throw new AppError("Unauthorized access", 401);
        }
        const userId = req.user._id.toString();
        const employee = await EmployeeService.updateEmployeeService(userId, req.body);

        res.status(200).json({
            success: true,
            message: "Employee profile updated successfully",
            data: employee,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteMyEmployeeProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) {
            throw new AppError("Unauthorized access", 401);
        }
        const userId = req.user._id.toString();
        await EmployeeService.deleteEmployeeService(userId);

        res.status(200).json({
            success: true,
            message: "Employee profile deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
