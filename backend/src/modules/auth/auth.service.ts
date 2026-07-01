import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository.js";
import { generateAccessToken, generateRefreshToken } from "./tokens.js";
import { JWT_CONFIG } from "../../config/jwt.js";
import type { User } from "./auth.types.js";
import { getUsersCollection } from "../../lib/mongodb.js";
import { ObjectId } from "mongodb";

export class AuthService {
  private repository = new AuthRepository();

  async register(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User> {
    const existingUser = await this.repository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await this.repository.create({
      email: data.email.toLowerCase(),
      password: hashedPassword,
      name: data.name || "",
      role: "USER",
      isVerified: false,
    });

    return user;
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.repository.findByEmail(email.toLowerCase());
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    return user;
  }

  async generateTokens(userId: string) {
    const accessToken = generateAccessToken(userId, "", "");
    const refreshToken = generateRefreshToken(userId);

    // Hash and store refresh token for security
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.repository.updateRefreshToken(userId, hashedRefreshToken);

    return { accessToken, refreshToken };
  }

  // Used by refresh endpoint
  async refreshAccessToken(incomingRefreshToken: string) {
    try {
      const payload = jwt.verify(
        incomingRefreshToken,
        JWT_CONFIG.refreshTokenSecret,
      ) as { id: string };

      const user = await this.repository.findById(payload.id);
      if (!user) {
        throw new Error("User not found");
      }

      // Optional: Verify stored refresh token hash
      if (user.refreshToken) {
        const isValid = await bcrypt.compare(
          incomingRefreshToken,
          user.refreshToken,
        );
        if (!isValid) {
          throw new Error("Invalid refresh token");
        }
      }

      const accessToken = generateAccessToken(
        user._id!.toString(),
        user.email,
        user.role,
      );
      const newRefreshToken = generateRefreshToken(user._id!.toString());

      // Rotate refresh token
      const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
      await this.repository.updateRefreshToken(
        user._id!.toString(),
        hashedNewRefreshToken,
      );

      return { accessToken, newRefreshToken };
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  async invalidateRefreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        JWT_CONFIG.refreshTokenSecret,
      ) as { id: string };
      await this.repository.updateRefreshToken(payload.id, null);
    } catch (_) {
      // Token invalid → do nothing
    }
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
