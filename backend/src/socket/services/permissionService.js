import prisma from "../../config/database.js";

export async function getEditableDiagram(socket, diagramId) {
  if (!socket.data.joinedDiagrams.has(diagramId)) {
    return { error: "Join the diagram before editing" };
  }

  const userId = socket.data.user.id;

  const diagram = await prisma.diagram.findUnique({
    where: { id: diagramId },
    include: {
      collaborators: {
        where: { userId }
      }
    }
  });

  if (!diagram) {
    return { error: "Diagram not found" };
  }

  const isOwner = diagram.ownerId === userId;
  const isEditor = diagram.collaborators.some(
    (collaborator) => collaborator.role === "EDITOR"
  );

  if (!isOwner && !isEditor) {
    return { error: "You don't have editing permission" };
  }

  return { diagram };
}