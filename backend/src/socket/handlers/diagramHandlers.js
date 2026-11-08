
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
            if (
                typeof diagramId !== "string" ||
                !diagramId.trim()
            ) {
                return ack?.({
                    success: false,
                    message: "Invalid diagramId"
                });
            }

            // 1. Fetch latest diagram from database
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

            // 2. Check access permissions
            const isOwner = diagram.ownerId === userId;
            const isCollaborator = diagram.collaborators.length > 0;
            const isPublic = diagram.visibility === "PUBLIC";

            if (!isOwner && !isCollaborator && !isPublic) {
                return ack?.({
                    success: false,
                    message: "Access denied"
                });
            }

            // 3. Join room if not already joined
            if (!socket.data.joinedDiagrams.has(diagramId)) {
                await socket.join(`diagram:${diagramId}`);
                socket.data.joinedDiagrams.add(diagramId);

                addSocketToDiagram(socket, diagramId, io);
            }

            // 4. Send latest saved state to client
            return ack?.({
                success: true,
                message: "Joined diagram successfully",
                diagram: {
                    id: diagram.id,
                    title: diagram.title,
                    nodes: diagram.nodes,
                    edges: diagram.edges,
                    version: diagram.version,
                    updatedAt: diagram.updatedAt
                }
            });

        } catch (error) {
            console.error("Diagram join error:", error);

            return ack?.({
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
