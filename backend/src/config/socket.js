import { Server } from "socket.io";
import { authenticateSocket } from "../socket/socketAuth.js";
import { registerSocketHandlers } from "../socket/socketHandlers.js";

import {
  addConnectedUser,
  removeConnectedUser,
  removeSocketFromDiagram
} from "../socket/services/presenceService.js";

export { diagramUsers, connectedUsers } from "../socket/services/presenceService.js";

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    allowRequest: (req, callback) => {
      const origin = req.headers.origin;
      callback(null, !origin || origin === "http://localhost:3000");
    }
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const userId = socket.data.user.id;

    addConnectedUser(userId, socket.id);

    socket.data.joinedDiagrams = new Set();

    registerSocketHandlers(io, socket);

    socket.on("disconnect", () => {
      removeConnectedUser(userId, socket.id);

      for (const diagramId of [...socket.data.joinedDiagrams]) {
        removeSocketFromDiagram(socket, diagramId, io);
      }
    });
  });

  return io;
};