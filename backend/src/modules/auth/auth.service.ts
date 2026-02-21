
import { AppError } from '../../utils/AppError';
import { generateTokens, verifyToken, TokenPayload, refreshAccessToken as refreshUtil } from '../../utils/jwt';
import { comparePassword } from '../../utils/password';
import { findUserByEmail, createUser, findUserById } from '../users/user.service';
import { LoginDto, RegisterDto } from './auth.validation';

/**
 * Represents the result of an authentication operation (login or register).
 */
export interface AuthResult {
    user: Omit<any, 'password'>;
    accessToken: string;
    refreshToken: string;
}

/**
 * Registers a new user.
 * @param userData - The registration data.
 * @returns The authentication result.
 */
export const registerUser = async (userData: RegisterDto): Promise<AuthResult> => {
    const { name, email, password } = userData;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new AppError('User with this email already exists', 409);
    }

    const newUser = await createUser({ name, email, password });

    const { accessToken, refreshToken } = generateTokens(newUser);

    const { password: _, ...userWithoutPassword } = newUser as any;
    return { user: userWithoutPassword, accessToken, refreshToken };
};

/**
 * Logs in a user.
 * @param loginData - The login data.
 * @returns The authentication result.
 */
export const loginUser = async (loginData: LoginDto): Promise<AuthResult> => {
    const { email, password } = loginData;

    const user = await findUserByEmail(email);
    // Debug: log whether user was found
    console.log(`🔐 login lookup for: ${email?.toLowerCase().trim()} — userFound: ${user ? 'yes' : 'no'}`);

    if (!user || !user.password) {
        throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    // Debug: log result of password comparison (true/false) — do NOT log password values
    console.log(`🔐 password compare result for ${email?.toLowerCase().trim()}: ${isPasswordValid}`);

    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user);

    const { password: _, ...userWithoutPassword } = user as any;
    return { user: userWithoutPassword, accessToken, refreshToken };
};

/**
 * Refreshes an access token using a refresh token.
 * @param refreshToken - The refresh token.
 * @returns A new access token.
 */
export const refreshAccessToken = (refreshToken: string): { accessToken: string } => {
    const newAccessToken = refreshUtil(refreshToken);
    if (!newAccessToken) {
        throw new AppError('Invalid or expired refresh token', 401);
    }
    return { accessToken: newAccessToken };
};
