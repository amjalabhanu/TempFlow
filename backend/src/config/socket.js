import { Server } from "socket.io";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import prisma from "./database.js";

export const connectedUsers = new Map();

let io;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Authenticate every incoming socket connection
  io.use(async (socket, next) => {
    try {
      const cookies = parse(socket.handshake.headers.cookie || "");
      const token = cookies.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        select: {
          id: true,
          tokenVersion: true
        }
      });

      if (!user || user.tokenVersion !== decoded.tokenVersion) {
        return next(new Error("Invalid or expired session"));
      }

      socket.data.user = { id: user.id };

      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  // Handle authenticated connections
  io.on("connection", (socket) => {
    const userId = socket.data.user.id;

    console.log(`User ${userId} connected: ${socket.id}`);

    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }

    connectedUsers.get(userId).add(socket.id);

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected: ${socket.id}`);

      const sockets = connectedUsers.get(userId);

      if (sockets) {
        sockets.delete(socket.id);

        if (sockets.size === 0) {
          connectedUsers.delete(userId);
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};