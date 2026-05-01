import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";
import { AppError } from "../utils/AppError.utils";
import * as AiService from "../services/aiInterview.services";

export const startRound = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) throw new AppError("Unauthorized", 401);
        const data = await AiService.startRoundService(
            req.params.interviewId,
            Number(req.params.roundIndex),
            req.user._id as string,
        );
        res.status(200).json({
            success: true,
            message: "Round started",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const answerInRound = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) throw new AppError("Unauthorized", 401);
        const data = await AiService.answerInRoundService(
            req.params.interviewId,
            Number(req.params.roundIndex),
            req.body.answer,
            req.user._id as string,
        );
        res.status(200).json({
            success: true,
            message: "Answer submitted",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const getRound = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) throw new AppError("Unauthorized", 401);
        const data = await AiService.getRoundService(
            req.params.interviewId,
            Number(req.params.roundIndex),
            req.user._id as string,
        );
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};
