
import "dotenv/config";
import { io } from "socket.io-client";
import { randomUUID } from "crypto";

const diagramId = process.env.TEST_DIAGRAM_ID;
const ownerToken = process.env.OWNER_TEST_TOKEN;
const collaboratorToken = process.env.COLLABORATOR_TEST_TOKEN;

if (!diagramId || !ownerToken || !collaboratorToken) {
  throw new Error("Missing test environment variables");
}

function connectClient(token) {
  return new Promise((resolve, reject) => {
    const socket = io("http://localhost:5000", {
      extraHeaders: {
        Cookie: `token=${token}`
      },
      transports: ["websocket", "polling"]
    });

    socket.once("connect", () => resolve(socket));
    socket.once("connect_error", reject);
  });
}

function joinDiagram(socket) {
  return new Promise((resolve, reject) => {
    socket.emit("diagram:join", { diagramId }, (response) => {
      if (!response?.success) {
        reject(new Error(response?.message || "Join failed"));
      } else {
        resolve(response);
      }
    });
  });
}

function createNode(socket, payload) {
  return new Promise((resolve) => {
    socket.emit("node:create", payload, resolve);
  });
}

const owner = await connectClient(ownerToken);
const collaborator = await connectClient(collaboratorToken);

try {
  await joinDiagram(owner);
  await joinDiagram(collaborator);

  console.log("Both users joined the diagram.");

  // Listen for operation on the owner's socket
  const operationReceived = new Promise((resolve) => {
    owner.once("diagram:operation", resolve);
  });

  const node = {
    id: `node-${randomUUID()}`,
    type: "process",
    position: { x: 200, y: 150 },
    data: { label: "Validate User" }
  };

  const payload = {
    diagramId,
    operationId: `op-${randomUUID()}`,
    node
  };

  // Collaborator creates node
  const ack = await createNode(collaborator, payload);

  console.log("\nCREATE ACK:", ack);

  // Owner receives broadcast
  const operation = await Promise.race([
    operationReceived,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Broadcast timeout")), 3000)
    )
  ]);

  console.log("\nOWNER RECEIVED OPERATION:");
  console.log(JSON.stringify(operation, null, 2));

  // Test duplicate node ID
  const duplicateAck = await createNode(collaborator, payload);
  console.log("\nDUPLICATE NODE TEST:", duplicateAck);

  // Test invalid payload
  const invalidAck = await createNode(collaborator, {
    diagramId,
    operationId: "invalid-op",
    node: { id: "invalid-node" }
  });

  console.log("\nINVALID PAYLOAD TEST:", invalidAck);

} catch (error) {
  console.error("TEST FAILED:", error.message);
} finally {
  owner.disconnect();
  collaborator.disconnect();
}
