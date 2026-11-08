import { performNodeMutation } from "../utils/operationHelper.js";

export function registerEdgeHandlers(io, socket) {

  // CREATE EDGE
  socket.on("edge:create", async (payload = {}, ack) => {
    const { edge } = payload;

    if (
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

    await performNodeMutation(
      socket,
      {
        ...payload,
        nodeId: id
      },
      ack,
      "edge:create",
      (nodes, edges) => {

        const sourceExists = nodes.some(
          node => node.id === source
        );

        const targetExists = nodes.some(
          node => node.id === target
        );

        if (!sourceExists || !targetExists) {
          return {
            error: "Source or target node not found in diagram"
          };
        }

        if (edges.some(existing => existing.id === id)) {
          return { error: "Edge already exists" };
        }

        return {
          nodes,
          edges: [...edges, edge],
          payload: { edge },
          response: { edge }
        };
      }
    );
  });


  // DELETE EDGE
  socket.on("edge:delete", async (payload = {}, ack) => {
    const { edgeId } = payload;

    if (
      typeof edgeId !== "string" ||
      !edgeId.trim()
    ) {
      return ack?.({
        success: false,
        message: "Invalid edge ID"
      });
    }

    await performNodeMutation(
      socket,
      {
        ...payload,
        nodeId: edgeId
      },
      ack,
      "edge:delete",
      (nodes, edges) => {

        const edgeExists = edges.some(
          edge => edge.id === edgeId
        );

        if (!edgeExists) {
          return { error: "Edge not found in diagram" };
        }

        return {
          nodes,
          edges: edges.filter(edge => edge.id !== edgeId),
          payload: { edgeId },
          response: { edgeId }
        };
      }
    );
  });

}