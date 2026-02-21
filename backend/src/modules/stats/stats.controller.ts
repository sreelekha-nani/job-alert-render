import { Request, Response, NextFunction } from 'express';
import { getDashboardStats } from './stats.service';

export const getStatsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.userId;
        const { hours } = req.query as any; // Already validated by Zod

        const stats = await getDashboardStats(userId, hours);
        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};
