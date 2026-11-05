import prisma from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../config/mailer.js";

export const registerUser = async ({ name, email, password }) => {
    // Check whether user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    });
    return user;
};

export const loginUser = async ({ email, password }) => {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }
    // Compare entered password with stored hash
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );
    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }
    // Generate JWT
    const token = jwt.sign(
        { sub: user.id, tokenVersion: user.tokenVersion },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        token
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