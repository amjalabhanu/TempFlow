
import prisma from "../../config/database.js";

export async function performNodeMutation(
  socket,
  payload,
  ack,
  operationType,
  mutate
) {
  const { diagramId, operationId, nodeId } = payload || {};

  if (
    typeof diagramId !== "string" ||
    !diagramId.trim() ||
    typeof operationId !== "string" ||
    !operationId.trim() ||
    operationId.length > 128 ||
    typeof nodeId !== "string" ||
    !nodeId.trim()
  ) {
    return ack?.({
      success: false,
      message: "Invalid payload"
    });
  }

  if (!socket.data.joinedDiagrams.has(diagramId)) {
    return ack?.({
      success: false,
      message: "Join the diagram before editing"
    });
  }

  const userId = socket.data.user.id;
  const maxRetries = 3;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          const diagram = await tx.diagram.findUnique({
            where: { id: diagramId },
            include: {
              collaborators: {
                where: { userId }
              }
            }
          });

          if (!diagram) {
            throw new Error("Diagram not found");
          }

          const isOwner = diagram.ownerId === userId;
          const isEditor = diagram.collaborators.some(
            c => c.role === "EDITOR"
          );

          if (!isOwner && !isEditor) {
            throw new Error("You don't have editing permission");
          }

          const existingOperation =
            await tx.diagramOperation.findUnique({
              where: {
                diagramId_operationId: {
                  diagramId,
                  operationId
                }
              }
            });

          if (existingOperation) {
            throw new Error("Duplicate operation");
          }

          const nodes = Array.isArray(diagram.nodes)
            ? diagram.nodes
            : [];

          const edges = Array.isArray(diagram.edges)
            ? diagram.edges
            : [];

          const mutation = mutate(nodes, edges);

          if (mutation.error) {
            throw new Error(mutation.error);
          }

          const sequence = diagram.version + 1;

          await tx.diagramOperation.create({
            data: {
              diagramId,
              operationId,
              sequence,
              type: operationType,
              payload: mutation.payload ?? {},
              userId
            }
          });

          await tx.diagram.update({
            where: { id: diagramId },
            data: {
              nodes: mutation.nodes,
              edges: mutation.edges,
              version: sequence
            }
          });

          return {
            diagramId,
            operationId,
            sequence,
            version: sequence,
            type: operationType,
            payload: mutation.payload,
            response: mutation.response
          };
        },
        {
          isolationLevel: "Serializable"
        }
      );

      socket.to(`diagram:${diagramId}`).emit(
        "diagram:operation",
        result
      );

      return ack?.({
        success: true,
        message: `${operationType} successful`,
        operationId: result.operationId,
        sequence: result.sequence,
        version: result.version,
        ...result.response
      });

    } catch (error) {
      // Retry serialization conflicts
      if (error.code === "P2034" && attempt < maxRetries) {
        console.warn(
          `Transaction conflict. Retrying ${attempt + 1}/${maxRetries}`
        );
        continue;
      }

      console.error(`${operationType} error:`, error);

      let message = "Unable to process operation";

      if (
        error.message === "Duplicate operation" ||
        error.code === "P2002"
      ) {
        message = "Duplicate operation";
      } else if (
        [
          "Diagram not found",
          "You don't have editing permission",
          "Join the diagram before editing"
        ].includes(error.message)
      ) {
        message = error.message;
      } else if (
        error.message !== "Unable to process operation"
      ) {
        message = error.message;
      }

      return ack?.({
        success: false,
        message
      });
    }
  }
}
