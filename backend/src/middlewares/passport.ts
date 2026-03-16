import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { VerifyCallback } from 'passport-jwt';
import { Request } from 'express';
import config from '../config';
import { findUserById } from '../modules/users/user.service';

/**
 * Represents the payload of a JWT token.
 */
export interface JwtPayload {
  userId: string;
  email: string;
}

/* ================= ACCESS TOKEN FROM COOKIE OR HEADER ================= */

const accessTokenExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['accessToken'];
  }
  if (!token) {
    token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  }
  return token;
};

const jwtOptions = {
  jwtFromRequest: accessTokenExtractor, 
  secretOrKey: config.jwt.accessSecret,
};

const jwtStrategy = new JwtStrategy(
  jwtOptions,
  async (payload: JwtPayload, done: VerifyCallback) => {
    try {
      const user = await findUserById(payload.userId);
      if (!user) {
        return done(null, false as any);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false as any);
    }
  }
);

/* ================= REFRESH TOKEN STRATEGY ================= */

const refreshTokenExtractor = (req: Request): string | null => {
  return req.cookies?.refreshToken || null;
};

const refreshJwtOptions = {
  jwtFromRequest: refreshTokenExtractor,
  secretOrKey: config.jwt.refreshSecret,
};

const refreshJwtStrategy = new JwtStrategy(
  refreshJwtOptions,
  async (payload: JwtPayload, done: VerifyCallback) => {
    try {
      if (!payload.userId) {
        return done(null, false as any);
      }
      return done(null, payload as any);
    } catch (err) {
      return done(err, false as any);
    }
  }
);

/* ================= SETUP PASSPORT ================= */

export const setupPassport = () => {
  passport.use('jwt', jwtStrategy);
  passport.use('jwt-refresh', refreshJwtStrategy);
};