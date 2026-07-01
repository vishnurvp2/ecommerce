import { type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../../config/jwt.js";
import { type AuthRequest } from "../../modules/auth/auth.types.js";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1] || "";

  try {
    const payload = jwt.verify(token, JWT_CONFIG.accessTokenSecret) as any;
    req.user = payload;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
