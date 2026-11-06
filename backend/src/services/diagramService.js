import prisma from "../config/database.js";

export const createDiagram = async (userId, data) => {
    return await prisma.diagram.create({
        data: {
            title: data.title || "Untitled Diagram",
            description: data.description,
            nodes: data.nodes,
            edges: data.edges,
            visibility: data.visibility,
            ownerId: userId
        }
    });
};

export const getUserDiagrams = async (userId) => {
    return await prisma.diagram.findMany({
        where: {
            OR: [
                { ownerId: userId },
                {
                    collaborators: {
                        some: { userId }
                    }
                },
                { visibility: "PUBLIC" }
            ]
        },
        orderBy: {
            updatedAt: "desc"
        }
    });
};

export const getDiagramById = async (diagramId, userId) => {
    const diagram = await prisma.diagram.findUnique({
        where: { id: diagramId },
        include: {
            collaborators: true
        }
    });

    if (!diagram) {
        throw new Error("DIAGRAM_NOT_FOUND");
    }

    const isOwner = diagram.ownerId === userId;
    const isCollaborator = diagram.collaborators.some(
        (collaborator) => collaborator.userId === userId
    );

    if (
        diagram.visibility !== "PUBLIC" &&
        !isOwner &&
        !isCollaborator
    ) {
        throw new Error("FORBIDDEN");
    }

    return diagram;
};
export const updateDiagram = async (diagramId, userId, data) => {
  const diagram = await prisma.diagram.findUnique({
    where: { id: diagramId },
    include: { collaborators: true }
  });

  if (!diagram) throw new Error("DIAGRAM_NOT_FOUND");

  const isOwner = diagram.ownerId === userId;
  const isEditor = diagram.collaborators.some(
    c => c.userId === userId && c.role === "EDITOR"
  );

  if (!isOwner && !isEditor) {
    throw new Error("FORBIDDEN");
  }

  return prisma.diagram.update({
    where: { id: diagramId },
    data
  });
};
export const deleteDiagram = async (diagramId, userId) => {
  const diagram = await prisma.diagram.findUnique({
    where: { id: diagramId }
  });

  if (!diagram) throw new Error("DIAGRAM_NOT_FOUND");

  if (diagram.ownerId !== userId) {
    throw new Error("FORBIDDEN");
  }

  return prisma.diagram.delete({
    where: { id: diagramId }
  });
};
export const duplicateDiagram = async (diagramId, userId) => {
  const original = await prisma.diagram.findUnique({
    where: { id: diagramId },
    include: { collaborators: true }
  });

  if (!original) throw new Error("DIAGRAM_NOT_FOUND");

  const isOwner = original.ownerId === userId;
  const isCollaborator = original.collaborators.some(
    c => c.userId === userId
  );

  if (
    original.visibility !== "PUBLIC" &&
    !isOwner &&
    !isCollaborator
  ) {
    throw new Error("FORBIDDEN");
  }

  return prisma.diagram.create({
    data: {
      title: `Copy of ${original.title}`,
      description: original.description,
      nodes: original.nodes,
      edges: original.edges,
      visibility: "PRIVATE",
      ownerId: userId
    }
  });
};
export const addCollaborator = async (
  diagramId,
  ownerId,
  userId,
  role
) => {
  const diagram = await prisma.diagram.findUnique({
    where: { id: diagramId }
  });

  if (!diagram) throw new Error("DIAGRAM_NOT_FOUND");

  if (diagram.ownerId !== ownerId) {
    throw new Error("FORBIDDEN");
  }

  if (userId === ownerId) {
    throw new Error("CANNOT_ADD_OWNER");
  }

  return prisma.diagramCollaborator.upsert({
    where: {
      diagramId_userId: {
        diagramId,
        userId
      }
    },
    update: { role },
    create: { diagramId, userId, role }
  });
};