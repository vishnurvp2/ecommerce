import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../../utils/cookie.js";
import { type AuthRequest } from "./auth.types.js";

export class AuthController {
  private authService = new AuthService();

  // POST /api/v1/auth/register
  register = async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      const user = await this.authService.register({ email, password, name });

      const { accessToken, refreshToken } =
        await this.authService.generateTokens(user._id!.toString());

      // Set HTTP-only cookie
      setRefreshTokenCookie(res, refreshToken);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          accessToken,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  };

  // POST /api/v1/auth/login
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await this.authService.login(email, password);

      const { accessToken, refreshToken } =
        await this.authService.generateTokens(user._id!.toString());

      setRefreshTokenCookie(res, refreshToken);

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          accessToken,
        },
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || "Invalid credentials",
      });
    }
  };

  // POST /api/v1/auth/refresh
  refreshToken = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token not found",
        });
      }

      const { accessToken, newRefreshToken } =
        await this.authService.refreshAccessToken(refreshToken);

      // Update cookie with new refresh token (rotation)
      setRefreshTokenCookie(res, newRefreshToken);

      res.json({
        success: true,
        data: { accessToken },
      });
    } catch (error: any) {
      clearRefreshTokenCookie(res);
      res.status(401).json({
        success: false,
        message: error.message || "Invalid refresh token",
      });
    }
  };

  // POST /api/v1/auth/logout
  logout = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        // Optional: invalidate refresh token in DB
        await this.authService.invalidateRefreshToken(refreshToken);
      }

      clearRefreshTokenCookie(res);

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      clearRefreshTokenCookie(res);
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    }
  };

  // GET /api/v1/auth/me (Protected route example)
  getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const user = await this.authService.getUserById(req.user.id);

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch user",
      });
    }
  };
}
