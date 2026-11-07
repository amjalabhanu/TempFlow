
import jwt from "jsonwebtoken";
import cookie from "cookie";
import prisma from "../config/database.js";

export const authenticateSocket = async (socket, next) => {
  try {
    const cookies = cookie.parse(
      socket.handshake.headers.cookie || ""
    );

    const token = cookies.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        name: true,
        tokenVersion: true
      }
    });

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return next(new Error("Unauthorized"));
    }

    socket.data.user = {
      id: user.id,
      name: user.name
    };

    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
};
