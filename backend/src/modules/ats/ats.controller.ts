import { Request, Response, NextFunction } from 'express';
import { checkAts } from './ats.service';

export const checkAtsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await checkAts(req.body);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};
