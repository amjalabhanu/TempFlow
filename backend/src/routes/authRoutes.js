import express from "express";
import { validate } from "../middleware/validateMiddleware.js";
import {
    register,
    login,
    logout,
    forgotPasswordController,
    resetPasswordController
} from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
    forgotPasswordSchema,
    resetPasswordSchema
} from "../validators/passwordResetValidator.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";


const router = express.Router();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bhanu
 *               email:
 *                 type: string
 *                 example: bhanu@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already registered
 */
router.post("/register", validate(registerSchema), register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: bhanu@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validate(loginSchema), login);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized or invalid token
 */
router.post("/logout", authenticateUser, logout);
router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    forgotPasswordController
);
router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPasswordController
);

export default router;