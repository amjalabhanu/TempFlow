import { io } from "socket.io-client";

const token = process.env.TEST_TOKEN;

if (!token) {
  console.error("Please provide TEST_TOKEN");
  process.exit(1);
}

const socket = io("http://localhost:5000", {
  extraHeaders: {
    Cookie: `token=${token}`
  },
  transports: ["websocket", "polling"]
});

socket.on("connect", () => {
  console.log("Connected successfully!");
  console.log("Socket ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("Connection failed:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});