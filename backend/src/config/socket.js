import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import prisma from "../config/database.js";

export const diagramUsers = new Map();
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
  });

  // Successful connection
  io.on("connection", (socket) => {
    const userId = socket.data.user.id;
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }

    connectedUsers.get(userId).add(socket.id);

    socket.data.joinedDiagrams = new Set();

    // JOIN DIAGRAM
    socket.on("diagram:join", async ({ diagramId } = {}, ack) => {
      try {
        if (!diagramId || typeof diagramId !== "string") {
          return ack?.({
            success: false,
            message: "Invalid diagramId"
          });
        }

        const diagram = await prisma.diagram.findUnique({
          where: { id: diagramId },
          include: {
            collaborators: {
              where: { userId }
            }
          }
        });

        if (!diagram) {
          return ack?.({
            success: false,
            message: "Diagram not found"
          });
        }

        const isOwner = diagram.ownerId === userId;
        const isCollaborator = diagram.collaborators.length > 0;
        const isPublic = diagram.visibility === "PUBLIC";

        if (!isOwner && !isCollaborator && !isPublic) {
          return ack?.({
            success: false,
            message: "Access denied"
          });
        }

        const room = `diagram:${diagramId}`;

        // Prevent duplicate joins
        if (socket.data.joinedDiagrams.has(diagramId)) {
          return ack?.({
            success: true,
            message: "Already joined",
            diagramId
          });
        }

        await socket.join(room);

        socket.data.joinedDiagrams.add(diagramId);

        if (!diagramUsers.has(diagramId)) {
          diagramUsers.set(diagramId, new Map());
        }

        const users = diagramUsers.get(diagramId);
        const isFirstConnection = !users.has(userId);

        if (!users.has(userId)) {
          users.set(userId, new Set());
        }

        users.get(userId).add(socket.id);
        broadcastPresence(io, diagramId);

        if (isFirstConnection) {
          const user = socket.data.user;

          socket.to(room).emit("diagram:user-joined", {
            diagramId,
            user
          });
        }

        ack?.({
          success: true,
          message: "Joined diagram room",
          diagramId
        });

      } catch (error) {
        console.error("Diagram join error:", error);

        ack?.({
          success: false,
          message: "Unable to join diagram"
        });
      }
    });


    // LEAVE DIAGRAM
    socket.on("diagram:leave", ({ diagramId } = {}, ack) => {
      if (!diagramId || typeof diagramId !== "string") {
        return ack?.({
          success: false,
          message: "Invalid diagramId"
        });
      }

      if (!socket.data.joinedDiagrams.has(diagramId)) {
        return ack?.({
          success: false,
          message: "Not in diagram room"
        });
      }

      removeSocketFromDiagram(socket, diagramId, io);

      ack?.({
        success: true,
        message: "Left diagram room",
        diagramId
      });
    });


    // DISCONNECT CLEANUP
    socket.on("disconnect", () => {
      const userSockets = connectedUsers.get(userId);

      if (userSockets) {
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          connectedUsers.delete(userId);
        }
      }
      for (const diagramId of socket.data.joinedDiagrams) {
        removeSocketFromDiagram(socket, diagramId, io);
      }
    });
  });

  return io;
};

function broadcastPresence(io, diagramId) {
  const usersMap = diagramUsers.get(diagramId);
  const users = [];

  if (usersMap) {
    for (const [userId, socketIds] of usersMap.entries()) {
      // Get one active socket for this user
      const socketId = socketIds.values().next().value;
      const activeSocket = io.sockets.sockets.get(socketId);

      if (activeSocket) {
        users.push({
          id: userId,
          name: activeSocket.data.user.name
        });
      }
    }
  }

  io.to(`diagram:${diagramId}`).emit("presence:update", {
    diagramId,
    users
  });
}

function removeSocketFromDiagram(socket, diagramId, io) {
  const userId = socket.data.user.id;
  const room = `diagram:${diagramId}`;

  socket.leave(room);
  socket.data.joinedDiagrams.delete(diagramId);

  const users = diagramUsers.get(diagramId);

  if (!users) return;

  const userSockets = users.get(userId);

  if (userSockets) {
    userSockets.delete(socket.id);

    // Notify only when the user's last connection leaves
    if (userSockets.size === 0) {
      users.delete(userId);

      io.to(room).emit("diagram:user-left", {
        diagramId,
        user: { id: userId }
      });
    }
  }
  broadcastPresence(io, diagramId);

  if (users.size === 0) {
    diagramUsers.delete(diagramId);
  }
}