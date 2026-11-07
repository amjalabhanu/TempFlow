import prisma from "../../config/database.js";
import { getEditableDiagram } from "../services/permissionService.js";

export async function performNodeMutation(
  socket,
  payload,
  ack,
  operationType,
  mutate
) {
  try {
    const { diagramId, operationId, nodeId } = payload;

    if (
      typeof diagramId !== "string" ||
      !diagramId.trim() ||
      typeof operationId !== "string" ||
      !operationId.trim() ||
      typeof nodeId !== "string" ||
      !nodeId.trim()
    ) {
      return ack?.({
        success: false,
        message: "Invalid payload"
      });
    }

    const { diagram, error } = await getEditableDiagram(
      socket,
      diagramId
    );

    if (error) {
      return ack?.({ success: false, message: error });
    }

    const nodes = Array.isArray(diagram.nodes) ? diagram.nodes : [];
    const edges = Array.isArray(diagram.edges) ? diagram.edges : [];

    const result = mutate(nodes, edges);

    if (result.error) {
      return ack?.({
        success: false,
        message: result.error
      });
    }

    await prisma.diagram.update({
      where: { id: diagramId },
      data: {
        nodes: result.nodes,
        edges: result.edges
      }
    });

    const operation = {
      diagramId,
      operationId,
      type: operationType,
      payload: result.payload
    };

    socket.to(`diagram:${diagramId}`).emit(
      "diagram:operation",
      operation
    );

    ack?.({
      success: true,
      message: `${operationType} successful`,
      operationId,
      ...result.response
    });

  } catch (error) {
    console.error(`${operationType} error:`, error);

    ack?.({
      success: false,
      message: "Unable to process node operation"
    });
  }
}