import { registerDiagramHandlers } from "./handlers/diagramHandlers.js";
import { registerNodeHandlers } from "./handlers/nodeHandlers.js";
import { registerEdgeHandlers } from "./handlers/edgeHandlers.js";
import { registerCursorHandlers } from "./handlers/cursorHandlers.js";

export function registerSocketHandlers(io, socket) {
  registerDiagramHandlers(io, socket);
  registerNodeHandlers(io, socket);
  registerEdgeHandlers(io, socket);
  registerCursorHandlers(io, socket);
}
