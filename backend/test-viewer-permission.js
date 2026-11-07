
import "dotenv/config";
import { io } from "socket.io-client";
import { randomUUID } from "crypto";

const socket = io("http://localhost:5000", {
  extraHeaders: {
    Cookie: `token=${process.env.VIEWER_TEST_TOKEN}`
  },
  transports: ["websocket", "polling"]
});

const diagramId = process.env.TEST_DIAGRAM_ID;

socket.on("connect", () => {
  console.log("VIEWER CONNECTED");

  socket.emit("diagram:join", { diagramId }, (joinResponse) => {
    console.log("JOIN:", joinResponse);

    if (!joinResponse.success) {
      socket.disconnect();
      return;
    }

    socket.emit("node:create", {
      diagramId,
      operationId: `op-${randomUUID()}`,
      node: {
        id: `viewer-node-${randomUUID()}`,
        type: "process",
        position: { x: 400, y: 200 },
        data: { label: "Viewer Attempt" }
      }
    }, (response) => {
      console.log("VIEWER CREATE RESPONSE:", response);

      if (
        response.success === false &&
        response.message === "You don't have editing permission"
      ) {
        console.log("PASS: VIEWER CANNOT CREATE NODES");
      } else {
        console.log("FAIL: Unexpected permission result");
      }

      socket.disconnect();
    });
  });
});

socket.on("connect_error", (error) => {
  console.error("CONNECTION ERROR:", error.message);
});
