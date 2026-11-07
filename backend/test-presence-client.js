import "dotenv/config";
import { io } from "socket.io-client";
import readline from "readline";

const role = process.env.TEST_ROLE;

const token =
  role === "OWNER"
    ? process.env.OWNER_TEST_TOKEN
    : process.env.COLLABORATOR_TEST_TOKEN;

const diagramId = process.env.TEST_DIAGRAM_ID;


if (!token || !diagramId) {
  console.error("Missing TEST_TOKEN or DIAGRAM_ID");
  process.exit(1);
}

const socket = io("http://localhost:5000", {
  extraHeaders: {
    Cookie: `token=${token}`
  },
  transports: ["websocket", "polling"]
});

socket.on("connect", () => {
  console.log("\nCONNECTED:", socket.id);

  socket.emit("diagram:join", { diagramId }, (response) => {
    console.log("JOIN:", response);
  });
});

socket.on("presence:update", (data) => {
  console.log("\nPRESENCE UPDATE:");
  console.log(JSON.stringify(data, null, 2));
});

socket.on("diagram:user-joined", (data) => {
  console.log("USER JOINED:", data);
});

socket.on("diagram:user-left", (data) => {
  console.log("USER LEFT:", data);
});

socket.on("connect_error", (err) => {
  console.error("CONNECTION ERROR:", err.message);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("\nCommands: leave | disconnect");

rl.on("line", (command) => {
  if (command.trim() === "leave") {
    socket.emit("diagram:leave", { diagramId }, (response) => {
      console.log("LEAVE:", response);
    });
  }

  if (command.trim() === "disconnect") {
    socket.disconnect();
    console.log("DISCONNECTED");
    rl.close();
  }
});
