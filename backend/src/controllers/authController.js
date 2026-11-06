import { registerUser } from "../services/authService.js";
import { loginUser, logoutUser } from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {
    forgotPassword,
    resetPassword
} from "../services/authService.js";


export const register = asyncHandler(async (req, res) => {
    try {
        const user = await registerUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });
    } catch (error) {
        if (error.message === "EMAIL_ALREADY_EXISTS") {
            throw new ApiError(409, "Email already registered");
        }

        if (error.message === "USERNAME_ALREADY_EXISTS") {
            throw new ApiError(409, "Username already taken");
        }

        throw error;
    }
});
export const login = asyncHandler(async (req, res) => {
    try {
        const result = await loginUser(req.body);

        const cookieMaxAge = result.rememberMe
            ? 30 * 24 * 60 * 60 * 1000  // 30 days
            : 24 * 60 * 60 * 1000;      // 1 day

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: cookieMaxAge,
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result.user
        });

    } catch (error) {
        if (error.message === "INVALID_CREDENTIALS") {
            throw new ApiError(401, "Invalid email or password");
        }
        throw error;
    }
});
export const forgotPasswordController = asyncHandler(async (req, res) => {
    await forgotPassword(req.body.email);

    return res.status(200).json({
        success: true,
        message: "If an account exists with this email, a reset link has been sent."
    });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
    try {
        await resetPassword(req.body.token, req.body.newPassword);

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please login again."
        });
    } catch (error) {
        if (error.message === "INVALID_RESET_TOKEN") {
            throw new ApiError(400, "Invalid or expired reset link");
        }
        throw error;
    }
});

export const logout = asyncHandler(async (req, res) => {
    await logoutUser(req.user.id);

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});