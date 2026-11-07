
import "dotenv/config";
import { io } from "socket.io-client";
import { randomUUID } from "crypto";

const diagramId = process.env.TEST_DIAGRAM_ID;
const nodeId = process.env.TEST_NODE_ID;

const owner = io("http://localhost:5000", {
  extraHeaders: {
    Cookie: `token=${process.env.OWNER_TEST_TOKEN}`
  }
});

const collaborator = io("http://localhost:5000", {
  extraHeaders: {
    Cookie: `token=${process.env.COLLABORATOR_TEST_TOKEN}`
  }
});

owner.on("connect", () => {
  console.log("OWNER CONNECTED");
});

collaborator.on("connect", () => {
  console.log("COLLABORATOR CONNECTED");

  collaborator.emit("diagram:join", { diagramId }, (response) => {
    console.log("COLLABORATOR JOIN:", response);

    if (!response.success) return;

    runTests();
  });
});

owner.on("diagram:operation", (operation) => {
  console.log("OWNER RECEIVED OPERATION:", operation);
});

function emitOperation(event, payload) {
  return new Promise((resolve) => {
    collaborator.emit(event, payload, resolve);
  });
}

async function runTests() {
  // 1. UPDATE NODE
  const updateResult = await emitOperation("node:update", {
    diagramId,
    operationId: randomUUID(),
    nodeId,
    updates: {
      data: { label: "Updated Process" }
    }
  });

  console.log("UPDATE RESULT:", updateResult);

  // 2. MOVE NODE
  const moveResult = await emitOperation("node:move", {
    diagramId,
    operationId: randomUUID(),
    nodeId,
    position: { x: 500, y: 300 }
  });

  console.log("MOVE RESULT:", moveResult);

  // 3. DELETE NODE
  const deleteResult = await emitOperation("node:delete", {
    diagramId,
    operationId: randomUUID(),
    nodeId
  });

  console.log("DELETE RESULT:", deleteResult);

  setTimeout(() => {
    owner.disconnect();
    collaborator.disconnect();
  }, 1000);
}
