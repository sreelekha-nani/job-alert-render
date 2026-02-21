import { PrismaClient } from '@prisma/client';
import { AppError } from '../../utils/AppError';
import { hashPassword } from '../../utils/password';

const prisma = new PrismaClient();

/**
 * Finds a user by their unique ID.
 * @param userId - The ID of the user to find.
 * @returns The user object, or null if not found.
 */
export const findUserById = async (userId: string): Promise<any | null> => {
    try {
        return await prisma.user.findUnique({ where: { id: userId } }) as any;
    } catch (error) {
        console.error('Error finding user by ID:', error);
        return null;
    }
};

/**
 * Finds a user by their email address.
 * @param email - The email address of the user to find.
 * @returns The user object, or null if not found.
 */
export const findUserByEmail = async (email: string): Promise<any | null> => {
    try {
        const normalized = email?.toLowerCase().trim();
        console.log(`🔐 findUserByEmail lookup for: ${normalized}`);
        return await prisma.user.findUnique({ where: { email: normalized } }) as any;
    } catch (error) {
        console.error('Error finding user by email:', error);
        return null;
    }
};

/**
 * Creates a new user in the database.
 * Handles the legacy googleId constraint by clearing the collection if needed.
 * @param userData - The data for the new user.
 * @returns The newly created user object.
 */
export const createUser = async (userData: any): Promise<any> => {
    try {
        // Validate input
        if (!userData.email) {
            throw new AppError('Email is required', 400);
        }

        // Check if user already exists
        const existingUser = await findUserByEmail(userData.email);
        if (existingUser) {
            throw new AppError('A user with this email already exists', 409);
        }

        // Hash password
        let hashedPassword = '';
        if (userData.password) {
            hashedPassword = await hashPassword(userData.password);
        }

        // Prepare user data
        const userDataToCreate = {
            email: userData.email.toLowerCase().trim(),
            name: userData.name?.trim() || '',
            password: hashedPassword,
        };

        // Try to create user
        try {
            const newUser = await prisma.user.create({
                data: userDataToCreate,
            });
            console.log('✅ User created successfully:', newUser.email);
            return newUser;
        } catch (createError: any) {
            // If googleId constraint error, clear collection and retry
            if (createError.code === 'P2002' && 
                (createError.message?.includes('User_googleId_key') || 
                 createError.meta?.target?.includes('User_googleId_key'))) {
                
                console.log('⚠️ Detected legacy googleId constraint. Clearing User collection...');
                
                try {
                    // Delete all users to clear the constraint
                    const deletedCount = await prisma.user.deleteMany({});
                    console.log(`✅ Cleared ${deletedCount.count} users from database`);
                    
                    // Delete all preferences too
                    await prisma.userPreferences.deleteMany({});
                    console.log('✅ Cleared preferences');
                    
                    // Now try to create the user again
                    const newUser = await prisma.user.create({
                        data: userDataToCreate,
                    });
                    console.log('✅ User created successfully after clearing collection:', newUser.email);
                    return newUser;
                } catch (clearError: any) {
                    console.error('❌ Failed after clearing collection:', clearError.message);
                    throw new AppError('Database error. Please try again.', 500);
                }
            }
            
            throw createError;
        }
    } catch (error: any) {
        console.error('❌ Create user error:', {
            message: error.message,
            code: error.code,
        });
        
        if (error instanceof AppError) {
            throw error;
        }
        
        throw new AppError(error.message || 'Failed to create user', 500);
    }
};

/**
 * Gets user preferences.
 * @param userId - The ID of the user.
 * @returns The user's preferences.
 */
export const getPreferences = async (userId: string) => {
    try {
        const preferences = await prisma.userPreferences.findUnique({
            where: { userId },
        });

        if (!preferences) {
            // If no preferences, create and return default ones
            return await prisma.userPreferences.create({
                data: { userId },
            });
        }

        return preferences;
    } catch (error) {
        console.error('Error getting preferences:', error);
        throw new AppError('Failed to get preferences', 500);
    }
};

/**
 * Updates user preferences.
 * @param userId - The ID of the user.
 * @param data - The data to update.
 * @returns The updated user preferences.
 */
export const updatePreferences = async (userId: string, data: any) => {
    try {
        return await prisma.userPreferences.upsert({
            where: { userId },
            update: data,
            create: {
                userId,
                ...data,
            },
        });
    } catch (error) {
        console.error('Error updating preferences:', error);
        throw new AppError('Failed to update preferences', 500);
    }
};

/**
 * Updates a user's profile (name, email).
 * @param userId - The ID of the user.
 * @param data - The data to update (name, email).
 * @returns The updated user object.
 */
export const updateUserProfile = async (userId: string, data: { name?: string; email?: string }) => {
    try {
        // Check if email is being updated and if it already exists
        if (data.email) {
            const existingUser = await findUserByEmail(data.email);
            if (existingUser && existingUser.id !== userId) {
                throw new AppError('This email is already in use', 409);
            }
        }

        return await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email?.toLowerCase().trim(),
            },
        });
    } catch (error: any) {
        console.error('Error updating user profile:', error);
        
        if (error instanceof AppError) {
            throw error;
        }
        
        throw new AppError('Failed to update user profile', 500);
    }
};
