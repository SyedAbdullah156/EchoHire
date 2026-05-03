import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";
import { AppError } from "../utils/AppError.utils";
import * as AiService from "../services/aiInterview.services";

const getNormalizedParam = (value: string | string[] | undefined): string => {
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
};

export const startRound = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) throw new AppError("Unauthorized", 401);
        const interviewId = getNormalizedParam(req.params.interviewId);
        if (!interviewId) throw new AppError("Interview ID is required", 400);

        const data = await AiService.startRoundService(
            req.params.interviewId.toString(),
            Number(req.params.roundIndex),
            req.user._id.toString(),
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
        const interviewId = getNormalizedParam(req.params.interviewId);
        if (!interviewId) throw new AppError("Interview ID is required", 400);

        const data = await AiService.answerInRoundService(
            req.params.interviewId.toString(),
            Number(req.params.roundIndex),
            req.body.content,
            req.user._id.toString(),
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

export const voiceAnswer = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?._id) throw new AppError("Unauthorized", 401);
        if (!req.file) throw new AppError("Audio file is required", 400);
        const interviewId = getNormalizedParam(req.params.interviewId);
        if (!interviewId) throw new AppError("Interview ID is required", 400);

        const data = await AiService.answerInRoundService(
            req.params.interviewId.toString(),
            Number(req.params.roundIndex),
            undefined, // No text content
            req.user._id.toString(),
            req.file.buffer, // Audio buffer
        );

        res.status(200).json({
            success: true,
            message: "Voice answer processed",
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
        const interviewId = getNormalizedParam(req.params.interviewId);
        if (!interviewId) throw new AppError("Interview ID is required", 400);

        const data = await AiService.getRoundService(
            req.params.interviewId.toString(),
            Number(req.params.roundIndex),
            req.user._id.toString(),
        );
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const answerInRoundStreaming = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { interviewId, roundIndex } = req.params;
        const { content } = req.body;
        const userId = req.user!._id!.toString();

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        await AiService.answerInRoundStreamingService(
            interviewId.toString(),
            Number(roundIndex),
            content,
            userId,
            (chunk) => {
                res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
            },
            req.file?.buffer,
        );

        res.write(`data: [DONE]\n\n`);
        res.end();
    } catch (error) {
        if (res.headersSent) {
            res.write(`data: ${JSON.stringify({ error: "Stream interrupted due to a server error." })}\n\n`);
            res.end();
        } else {
            next(error);
        }
    }
};
