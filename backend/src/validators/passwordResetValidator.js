import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.string().trim().email("Invalid email address")
}).strict();

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z.string().min(8, "Password must contain at least 8 characters")
}).strict();