
import { io } from "socket.io-client";

const token = process.env.TEST_TOKEN;
const diagramId = process.env.DIAGRAM_ID;

if (!token || !diagramId) {
  console.error("Provide TEST_TOKEN and DIAGRAM_ID");
  process.exit(1);
}

const socket = io("http://localhost:5000", {
  extraHeaders: {
    Cookie: `token=${token}`
  },
  transports: ["websocket"]
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  // Join diagram
  socket.emit("diagram:join", { diagramId }, (response) => {
    console.log("JOIN RESPONSE:", response);

    if (!response.success) {
      socket.disconnect();
      return;
    }

    // Leave diagram
    socket.emit("diagram:leave", { diagramId }, (leaveResponse) => {
      console.log("LEAVE RESPONSE:", leaveResponse);
      socket.disconnect();
    });
  });
});

socket.on("connect_error", (error) => {
  console.error("Connection failed:", error.message);
});

socket.on("diagram:user-joined", (data) => {
  console.log("USER JOINED:", data);
});

socket.on("diagram:user-left", (data) => {
  console.log("USER LEFT:", data);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});
