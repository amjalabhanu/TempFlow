import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import prisma from "../config/database.js";

export const connectedUsers = new Map();

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    allowRequest: (req, callback) => {
      const origin = req.headers.origin;

      callback(
        null,
        !origin || origin === "http://localhost:3000"
      );
    }
  });

  // Authenticate every incoming socket connection
  io.use(async (socket, next) => {
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
          tokenVersion: true
        }
      });

      if (!user || user.tokenVersion !== decoded.tokenVersion) {
        return next(new Error("Unauthorized"));
      }

      socket.data.user = {
        id: user.id
      };

      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  // Successful connection
  io.on("connection", (socket) => {
    const userId = socket.data.user.id;

    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }

    connectedUsers.get(userId).add(socket.id);

    console.log(`User connected: ${userId}`);
    console.log(`Socket ID: ${socket.id}`);

    // Disconnection
    socket.on("disconnect", () => {
      const userSockets = connectedUsers.get(userId);

      if (userSockets) {
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          connectedUsers.delete(userId);
        }
      }

      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
};