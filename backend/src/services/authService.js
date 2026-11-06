import prisma from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../config/mailer.js";

export const registerUser = async ({ name, username, email, password }) => {
    const existingEmail = await prisma.user.findUnique({
        where: { email }
    });

    if (existingEmail) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const existingUsername = await prisma.user.findUnique({
        where: { username }
    });

    if (existingUsername) {
        throw new Error("USERNAME_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        return await prisma.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                createdAt: true
            }
        });
    } catch (error) {
        // Handle concurrent duplicate registration attempts.
        if (error.code === "P2002") {
            const field = error.meta?.target?.includes("username")
                ? "USERNAME_ALREADY_EXISTS"
                : "EMAIL_ALREADY_EXISTS";

            throw new Error(field);
        }

        throw error;
    }
};

export const loginUser = async ({ email, password, rememberMe = false }) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const expiresIn = rememberMe ? "30d" : "1d";

    const token = jwt.sign(
        { sub: user.id, tokenVersion: user.tokenVersion },
        process.env.JWT_SECRET,
        { expiresIn }
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        token,
        rememberMe
    };
};
export const forgotPassword = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    // Don't reveal whether an email exists.
    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: expiresAt
        }
    });

    const resetLink =
        `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    try {
        await sendPasswordResetEmail(user.email, resetLink);
    } catch (error) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        throw error;
    }
};

export const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await prisma.user.findFirst({
        where: {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {
                gt: new Date()
            }
        }
    });

    if (!user) {
        throw new Error("INVALID_RESET_TOKEN");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
            tokenVersion: { increment: 1 }
        }
    });
};

export const logoutUser = async (userId) => {
    await prisma.user.update({
        where: { id: userId },
        data: {
            tokenVersion: {
                increment: 1
            }
        }
    });
};