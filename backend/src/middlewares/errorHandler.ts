import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Set default status code
    let statusCode = 500;
    let message = 'An unexpected error occurred';

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else {
        // Log the error for debugging purposes
        console.error('UNHANDLED ERROR:', {
            name: err.name,
            message: err.message,
            stack: err.stack,
        });
        
        // Provide more specific error messages in development
        if (process.env.NODE_ENV === 'development') {
            message = err.message || 'An unexpected error occurred';
        }
    }

    // Always return proper JSON
    res.status(statusCode).json({
        message,
        status: 'error',
    });
};
