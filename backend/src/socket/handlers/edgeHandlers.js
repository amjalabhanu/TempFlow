import prisma from "../../config/database.js";
import { getEditableDiagram } from "../services/permissionService.js";

export function registerEdgeHandlers(io, socket) {

  // CREATE EDGE
  socket.on("edge:create", async (payload = {}, ack) => {
    try {
      const { diagramId, operationId, edge } = payload;

      if (
        typeof diagramId !== "string" ||
        !diagramId.trim() ||
        typeof operationId !== "string" ||
        !operationId.trim() ||
        !edge ||
        typeof edge !== "object" ||
        Array.isArray(edge)
      ) {
        return ack?.({ success: false, message: "Invalid payload" });
      }

      const { id, source, target } = edge;

      if (
        typeof id !== "string" || !id.trim() ||
        typeof source !== "string" || !source.trim() ||
        typeof target !== "string" || !target.trim()
      ) {
        return ack?.({ success: false, message: "Invalid edge structure" });
      }

      const { diagram, error } = await getEditableDiagram(socket, diagramId);

      if (error) {
        return ack?.({ success: false, message: error });
      }

      const nodes = Array.isArray(diagram.nodes) ? diagram.nodes : [];
      const edges = Array.isArray(diagram.edges) ? diagram.edges : [];

      if (edges.some(existing => existing.id === id)) {
        return ack?.({ success: false, message: "Edge already exists" });
      }

      if (
        !nodes.some(node => node.id === source) ||
        !nodes.some(node => node.id === target)
      ) {
        return ack?.({ success: false, message: "Source or target node not found" });
      }

      await prisma.diagram.update({
        where: { id: diagramId },
        data: { edges: [...edges, edge] }
      });

      socket.to(`diagram:${diagramId}`).emit("diagram:operation", {
        diagramId,
        operationId,
        type: "edge:create",
        payload: { edge }
      });

      ack?.({ success: true, message: "Edge created", operationId, edge });

    } catch (error) {
      console.error("Edge creation error:", error);
      ack?.({ success: false, message: "Unable to create edge" });
    }
  });


  // DELETE EDGE
  socket.on("edge:delete", async (payload = {}, ack) => {
    try {
      const { diagramId, operationId, edgeId } = payload;

      if (
        typeof diagramId !== "string" ||
        typeof operationId !== "string" ||
        typeof edgeId !== "string" ||
        !diagramId.trim() ||
        !operationId.trim() ||
        !edgeId.trim()
      ) {
        return ack?.({ success: false, message: "Invalid payload" });
      }

      const { diagram, error } = await getEditableDiagram(socket, diagramId);

      if (error) {
        return ack?.({ success: false, message: error });
      }

      const edges = Array.isArray(diagram.edges) ? diagram.edges : [];
      const updatedEdges = edges.filter(edge => edge.id !== edgeId);

      if (updatedEdges.length === edges.length) {
        return ack?.({ success: false, message: "Edge not found" });
      }

      await prisma.diagram.update({
        where: { id: diagramId },
        data: { edges: updatedEdges }
      });

      socket.to(`diagram:${diagramId}`).emit("diagram:operation", {
        diagramId,
        operationId,
        type: "edge:delete",
        payload: { edgeId }
      });

      ack?.({ success: true, message: "Edge deleted", operationId, edgeId });

    } catch (error) {
      console.error("Edge deletion error:", error);
      ack?.({ success: false, message: "Unable to delete edge" });
    }
  });

}