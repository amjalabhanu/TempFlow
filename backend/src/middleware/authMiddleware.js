import jwt from "jsonwebtoken";
import prisma from "../config/database.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const authenticateUser = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        throw new ApiError(401, "Authentication token required");
    }

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        throw new ApiError(401, "Invalid or expired token");
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        select: { id: true, tokenVersion: true }
    });

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
        throw new ApiError(401, "Session expired. Please login again");
    }

    req.user = { id: user.id };

    next();
});