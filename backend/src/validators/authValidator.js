import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(2).max(100),
    username: z.string().trim().min(3).max(30)
        .regex(/^[a-zA-Z0-9_]+$/, "Username can contain only letters, numbers and underscores"),
    email: z.string().trim().email(),
    password: z.string().min(8)
}).strict();
export const loginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1).max(72),
    rememberMe: z.boolean().optional().default(false)
});