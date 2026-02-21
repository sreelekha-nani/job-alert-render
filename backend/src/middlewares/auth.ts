import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AppError } from '../utils/AppError';
import { JwtPayload } from './passport'; // Import the payload type

/**
 * Custom callback for `passport.authenticate`.
 * Handles errors and user authentication, attaching the user to the request object.
 */
const authCallback = (req: Request, res: Response, next: NextFunction, requiredRole?: string) => 
    (err: any, user: Express.User | false, info: any) => {
        if (err) {
            return next(new AppError('Authentication error.', 500));
        }
        if (!user) {
            if (info?.name === 'TokenExpiredError') {
                return next(new AppError('Your token has expired. Please log in again.', 401));
            }
            return next(new AppError('Unauthorized: Access is denied due to invalid credentials.', 401));
        }

        req.user = user;

        return next();
};

/**
 * Middleware to protect routes that require authentication.
 */
export const auth = (requiredRole?: string) => (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, authCallback(req, res, next, requiredRole))(req, res, next);
};

/**
 * Middleware for authenticating with a refresh token.
 * Attaches the token payload to the request object.
 */
export const authRefresh = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt-refresh', { session: false }, (err: any, payload: JwtPayload | false, info: any) => {
        if (err) {
            return next(new AppError('Authentication error.', 500));
        }
        if (!payload) {
             if (info?.name === 'TokenExpiredError') {
                return next(new AppError('Your refresh token has expired. Please log in again.', 401));
            }
            return next(new AppError('Unauthorized: Invalid refresh token.', 401));
        }
        // Attach the payload to the request. The payload contains userId and email.
        req.user = payload;
        return next();
    })(req, res, next);
};
