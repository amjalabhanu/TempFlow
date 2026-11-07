
import prisma from "../../config/database.js";
import {
  addSocketToDiagram,
  removeSocketFromDiagram
} from "../services/presenceService.js";

export function registerDiagramHandlers(io, socket) {
  const userId = socket.data.user.id;

  // JOIN DIAGRAM
  socket.on("diagram:join", async ({ diagramId } = {}, ack) => {
    try {
      if (!diagramId || typeof diagramId !== "string") {
        return ack?.({
          success: false,
          message: "Invalid diagramId"
        });
      }

      const diagram = await prisma.diagram.findUnique({
        where: { id: diagramId },
        include: {
          collaborators: {
            where: { userId }
          }
        }
      });

      if (!diagram) {
        return ack?.({
          success: false,
          message: "Diagram not found"
        });
      }

      const isOwner = diagram.ownerId === userId;
      const isCollaborator = diagram.collaborators.length > 0;
      const isPublic = diagram.visibility === "PUBLIC";

      if (!isOwner && !isCollaborator && !isPublic) {
        return ack?.({
          success: false,
          message: "Access denied"
        });
      }

      const room = `diagram:${diagramId}`;

      if (socket.data.joinedDiagrams.has(diagramId)) {
        return ack?.({
          success: true,
          message: "Already joined",
          diagramId
        });
      }

      await socket.join(room);
      socket.data.joinedDiagrams.add(diagramId);

      addSocketToDiagram(socket, diagramId, io);

      ack?.({
        success: true,
        message: "Joined diagram room",
        diagramId
      });

    } catch (error) {
      console.error("Diagram join error:", error);

      ack?.({
        success: false,
        message: "Unable to join diagram"
      });
    }
  });

  // LEAVE DIAGRAM
  socket.on("diagram:leave", ({ diagramId } = {}, ack) => {
    if (!diagramId || typeof diagramId !== "string") {
      return ack?.({
        success: false,
        message: "Invalid diagramId"
      });
    }

    if (!socket.data.joinedDiagrams.has(diagramId)) {
      return ack?.({
        success: false,
        message: "Not in diagram room"
      });
    }

    removeSocketFromDiagram(socket, diagramId, io);

    ack?.({
      success: true,
      message: "Left diagram room",
      diagramId
    });
  });
}
