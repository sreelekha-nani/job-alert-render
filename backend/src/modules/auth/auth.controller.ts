import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import config from "../../config";
import { LoginDto, RegisterDto } from "./auth.validation";

/* ================= COOKIE HELPERS ================= */

const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60 * 1000,
  });
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie("refreshToken", { path: "/" });
  res.clearCookie("accessToken", { path: "/" });
};

/* ================= REGISTER ================= */

export const registerHandler = async (
  req: Request<{}, {}, RegisterDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, accessToken, refreshToken } =
      await authService.registerUser(req.body);

    setAuthCookies(res, accessToken, refreshToken);

    // 🔥 IMPORTANT: send token in JSON
    res.status(201).json({
      message: "User registered successfully",
      user,
      token: accessToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    next(error);
  }
};

/* ================= LOGIN ================= */

export const loginHandler = async (
  req: Request<{}, {}, LoginDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, accessToken, refreshToken } =
      await authService.loginUser(req.body);

    setAuthCookies(res, accessToken, refreshToken);

    // 🔥 CRITICAL FIX
    res.status(200).json({
      message: "Login successful",
      user,
      token: accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

/* ================= REFRESH ================= */

export const refreshTokenHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const { accessToken } = authService.refreshAccessToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ token: accessToken });
  } catch (error) {
    next(error);
  }
};

/* ================= LOGOUT ================= */

export const logoutHandler = (req: Request, res: Response) => {
  clearAuthCookies(res);
  res.status(200).json({ message: "Logout successful" });
};

/* ================= GET ME ================= */

export const getMeHandler = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(200).json(req.user);
};
