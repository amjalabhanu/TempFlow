import prisma from "../../config/database.js";
import { getEditableDiagram } from "../services/permissionService.js";

export function registerEdgeHandlers(io, socket) {

  // =================================
  // TASK 4.1 — CREATE EDGE
  // =================================

  socket.on("edge:create", async (payload = {}, ack) => {
    try {
      const { diagramId, operationId, edge } = payload;

      // 1. Validate payload
      if (
        typeof diagramId !== "string" || !diagramId.trim() ||
        typeof operationId !== "string" || !operationId.trim() ||
        !edge ||
        typeof edge !== "object" ||
        Array.isArray(edge)
      ) {
        return ack?.({
          success: false,
          message: "Invalid payload"
        });
      }

      const { id, source, target } = edge;

      // 2. Validate edge structure
      if (
        typeof id !== "string" || !id.trim() ||
        typeof source !== "string" || !source.trim() ||
        typeof target !== "string" || !target.trim()
      ) {
        return ack?.({
          success: false,
          message: "Invalid edge structure"
        });
      }

      // 3. Check diagram permissions
      const { diagram, error } = await getEditableDiagram(
        socket,
        diagramId
      );

      if (error) {
        return ack?.({ success: false, message: error });
      }

      const nodes = Array.isArray(diagram.nodes) ? diagram.nodes : [];
      const edges = Array.isArray(diagram.edges) ? diagram.edges : [];

      // 4. Verify source and target belong to this diagram
      const sourceExists = nodes.some(node => node.id === source);
      const targetExists = nodes.some(node => node.id === target);

      if (!sourceExists || !targetExists) {
        return ack?.({
          success: false,
          message: "Source or target node not found in diagram"
        });
      }

      // 5. Prevent duplicate edge IDs
      if (edges.some(existing => existing.id === id)) {
        return ack?.({
          success: false,
          message: "Edge already exists"
        });
      }

      // 6. Persist edge
      await prisma.diagram.update({
        where: { id: diagramId },
        data: {
          edges: [...edges, edge]
        }
      });

      // 7. Broadcast accepted operation
      socket.to(`diagram:${diagramId}`).emit("diagram:operation", {
        diagramId,
        operationId,
        type: "edge:create",
        payload: { edge }
      });

      // 8. Acknowledge sender
      ack?.({
        success: true,
        message: "Edge created successfully",
        operationId,
        edge
      });

    } catch (error) {
      console.error("Edge creation error:", error);

      ack?.({
        success: false,
        message: "Unable to create edge"
      });
    }
  });


  // =================================
  // TASK 4.2 — DELETE EDGE
  // =================================

  socket.on("edge:delete", async (payload = {}, ack) => {
    try {
      const { diagramId, operationId, edgeId } = payload;

      // 1. Validate payload
      if (
        typeof diagramId !== "string" || !diagramId.trim() ||
        typeof operationId !== "string" || !operationId.trim() ||
        typeof edgeId !== "string" || !edgeId.trim()
      ) {
        return ack?.({
          success: false,
          message: "Invalid payload"
        });
      }

      // 2. Check diagram permissions
      const { diagram, error } = await getEditableDiagram(
        socket,
        diagramId
      );

      if (error) {
        return ack?.({ success: false, message: error });
      }

      const edges = Array.isArray(diagram.edges) ? diagram.edges : [];

      // 3. Verify edge belongs to this diagram
      const edgeExists = edges.some(edge => edge.id === edgeId);

      if (!edgeExists) {
        return ack?.({
          success: false,
          message: "Edge not found in diagram"
        });
      }

      // 4. Remove edge
      const updatedEdges = edges.filter(edge => edge.id !== edgeId);

      // 5. Persist deletion
      await prisma.diagram.update({
        where: { id: diagramId },
        data: {
          edges: updatedEdges
        }
      });

      // 6. Broadcast deletion
      socket.to(`diagram:${diagramId}`).emit("diagram:operation", {
        diagramId,
        operationId,
        type: "edge:delete",
        payload: { edgeId }
      });

      // 7. Acknowledge sender
      ack?.({
        success: true,
        message: "Edge deleted successfully",
        operationId,
        edgeId
      });

    } catch (error) {
      console.error("Edge deletion error:", error);

      ack?.({
        success: false,
        message: "Unable to delete edge"
      });
    }
  });

}
