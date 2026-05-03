import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { getActiveTicketsCount } from "../config/socket.config";

export const getAdminStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const totalUsers = await User.countDocuments();
        const openTickets = getActiveTicketsCount();
        
        // Mock system health and latency for now
        // In a real app, these would come from monitoring tools or service health checks
        const systemHealth = "99.9%";
        const apiLatency = `${Math.floor(Math.random() * 20) + 30}ms`;

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                openTickets,
                systemHealth,
                apiLatency,
                alerts: [
                    { title: "Database Load Normal", time: "Just now", severity: "low", desc: "Primary cluster memory usage is at 42%." },
                    { title: "New Candidate Signup", time: "5m ago", severity: "low", desc: "A new candidate from San Francisco just joined." },
                ]
            },
        });
    } catch (error) {
        next(error);
    }
};
