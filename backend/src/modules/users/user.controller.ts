import { Request, Response, NextFunction } from 'express';
import { getPreferences, updatePreferences, updateUserProfile } from './user.service';

// ... (existing getProfileHandler and type declaration)

export const getPreferencesHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.userId;
        const preferences = await getPreferences(userId);
        res.status(200).json(preferences);
    } catch (error) {
        next(error);
    }
};

export const updatePreferencesHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.userId;
        const preferences = await updatePreferences(userId, req.body);
        res.status(200).json(preferences);
    } catch (error) {
        next(error);
    }
};

export const updateProfileHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.userId;
        const updatedUser = await updateUserProfile(userId, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

// Extend the Express Request type to include the user property
declare global {
    namespace Express {
        interface User {
            userId: string;
            email: string;
            // add other user properties here if needed
        }
    }
}

export const getProfileHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // The user object is attached to the request by the `auth` middleware
        const user = req.user;
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};
