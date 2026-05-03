import { Request, Response, NextFunction } from "express";
import { Notification } from "../models/notification.model";
import { AuthRequest } from "../types/request.types";
import { AppError } from "../utils/AppError.utils";

export const getMyNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new AppError("Unauthorized", 401);
        
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);
            
        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new AppError("Unauthorized", 401);
        
        await Notification.updateMany(
            { userId: req.user._id, read: false },
            { $set: { read: true } }
        );
        
        res.status(200).json({
            success: true,
            message: "Notifications marked as read",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new AppError("Unauthorized", 401);
        
        await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        
        res.status(200).json({
            success: true,
            message: "Notification deleted",
        });
    } catch (error) {
        next(error);
    }
};
