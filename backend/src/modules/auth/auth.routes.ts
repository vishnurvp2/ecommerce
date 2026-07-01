import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";

const router = Router();
const controller = new AuthController();

router.post("/register", validateRequest(registerSchema), controller.register);

router.post("/login", validateRequest(loginSchema), controller.login);

export default router;
