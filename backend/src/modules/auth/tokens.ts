import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../../config/jwt.js";

export const generateAccessToken = (
  userId: string,
  email: string,
  role: string,
) => {
  return jwt.sign({ id: userId, email, role }, JWT_CONFIG.accessTokenSecret, {
    expiresIn: JWT_CONFIG.accessTokenExpiry,
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_CONFIG.refreshTokenSecret, {
    expiresIn: JWT_CONFIG.refreshTokenExpiry,
  });
};
