import jwt from 'jsonwebtoken';
import config from '../config';

/**
 * Represents the payload of a JWT token.
 */
export interface TokenPayload {
    userId: string;
    email: string;
}

/**
 * Generates a JWT access token.
 * @param user - The user for whom the token is generated.
 * @returns The generated access token.
 */
export const generateAccessToken = (user: any): string => {
    const payload: TokenPayload = {
        userId: user.id,
        email: user.email,
    };
    return jwt.sign(payload, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessTokenExpiration as any,
    });
};

/**
 * Generates a JWT refresh token.
 * @param user - The user for whom the token is generated.
 * @returns The generated refresh token.
 */
export const generateRefreshToken = (user: any): string => {
    const payload: TokenPayload = {
        userId: user.id,
        email: user.email,
    };
    return jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshTokenExpiration as any,
    });
};

/**
 * Generates both an access and a refresh token.
 * @param user - The user for whom the tokens are generated.
 * @returns An object containing the access and refresh tokens.
 */
export const generateTokens = (user: any): { accessToken: string; refreshToken: string } => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken };
};

/**
 * Verifies a JWT token.
 * @param token - The token to verify.
 * @param secret - The secret to use for verification.
 * @returns The decoded token payload, or null if verification fails.
 */
export const verifyToken = <T>(token: string, secret: string): T | null => {
    try {
        return jwt.verify(token, secret) as T;
    } catch (error) {
        return null;
    }
};

/**
 * Refreshes an access token using a refresh token.
 * @param refreshToken - The refresh token to use.
 * @returns A new access token, or null if the refresh token is invalid.
 */
export const refreshAccessToken = (refreshToken: string): string | null => {
    const payload = verifyToken<TokenPayload>(refreshToken, config.jwt.refreshSecret);
    if (!payload) {
        return null;
    }
    // We can re-use the user object from the payload to generate a new token
    const user: any = {
      id: payload.userId,
      email: payload.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return generateAccessToken(user);
};
