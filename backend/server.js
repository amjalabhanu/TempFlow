
import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import prisma from "./src/config/database.js";
import http from "http";
import { initializeSocket } from "./src/config/socket.js";

const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Socket.IO initialized");
});

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down...`);

  httpServer.close(async () => {
    try {
      await prisma.$disconnect();
      console.log("Database disconnected.");
      process.exit(0);
    } catch (error) {
      console.error("Shutdown error:", error);
      process.exit(1);
    }
  });

  // Close Socket.IO connections
  io.close();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
