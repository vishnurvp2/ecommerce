import type { Request, Response, NextFunction } from "express";
import { z, ZodError, ZodType } from "zod";

// Helper to format Zod errors
const formatZodErrors = (error: ZodError) => {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message,
  }));
};

// Use ZodType (current recommended approach)
export const validateRequest = (schema: ZodType<any, any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.body);

      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: formatZodErrors(error),
        });
      }

      next(error);
    }
  };
};

// For query parameters
export const validateQuery = (schema: ZodType<any, any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = await schema.parseAsync(req.query);
      req.query = validatedQuery as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Query validation failed",
          errors: formatZodErrors(error),
        });
      }
      next(error);
    }
  };
};
