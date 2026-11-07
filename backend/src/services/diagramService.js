
import prisma from "../config/database.js";

// CREATE DIAGRAM
export const createDiagram = async (userId, data) => {
  return prisma.diagram.create({
    data: {
      title: data.title || "Untitled Diagram",
      description: data.description,
      category: data.category || "Flowchart",
      nodes: data.nodes || [],
      edges: data.edges || [],
      visibility: data.visibility || "PRIVATE",
      ownerId: userId,
    },
  });
};

// GET ALL USER DIAGRAMS
export const getUserDiagrams = async (userId) => {
  return prisma.diagram.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          collaborators: {
            some: { userId },
          },
        },
        { visibility: "PUBLIC" },
      ],
    },
    include: {
      collaborators: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

// GET SINGLE DIAGRAM
export const getDiagramById = async (diagramId, userId) => {
  const diagram = await prisma.diagram.findUnique({
    where: { id: diagramId },
    include: {
      collaborators: true,
    },
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

// UPDATE DIAGRAM
export const updateDiagram = async (diagramId, userId, data) => {
  const diagram = await prisma.diagram.findUnique({
    where: { id: diagramId },
    include: { collaborators: true },
  });

  if (!diagram) {
    throw new Error("DIAGRAM_NOT_FOUND");
  }

  const isOwner = diagram.ownerId === userId;
  const isEditor = diagram.collaborators.some(
    (collaborator) =>
      collaborator.userId === userId &&
      collaborator.role === "EDITOR"
  );

  if (!isOwner && !isEditor) {
    throw new Error("FORBIDDEN");
  }

  return prisma.diagram.update({
    where: { id: diagramId },
    data,
  });
};

// DELETE DIAGRAM PERMANENTLY
export const deleteDiagram = async (diagramId, userId) => {
  const diagram = await prisma.diagram.findUnique({
    where: { id: diagramId },
  });

  if (!diagram) {
    throw new Error("DIAGRAM_NOT_FOUND");
  }

  if (diagram.ownerId !== userId) {
    throw new Error("FORBIDDEN");
  }

  return prisma.diagram.delete({
    where: { id: diagramId },
  });
};

// DUPLICATE DIAGRAM
export const duplicateDiagram = async (diagramId, userId) => {
  const original = await prisma.diagram.findUnique({
    where: { id: diagramId },
    include: { collaborators: true },
  });

  if (!original) {
    throw new Error("DIAGRAM_NOT_FOUND");
  }

  const isOwner = original.ownerId === userId;
  const isCollaborator = original.collaborators.some(
    (collaborator) => collaborator.userId === userId
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
      category: original.category,
      nodes: original.nodes,
      edges: original.edges,
      visibility: "PRIVATE",
      favorite: false,
      trashed: false,
      ownerId: userId,
    },
  });
};

// ADD OR UPDATE COLLABORATOR
export const addCollaborator = async (
  diagramId,
  ownerId,
  userId,
  role
) => {
  const diagram = await prisma.diagram.findUnique({
    where: { id: diagramId },
  });

  if (!diagram) {
    throw new Error("DIAGRAM_NOT_FOUND");
  }

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
        userId,
      },
    },
    update: { role },
    create: {
      diagramId,
      userId,
      role,
    },
  });
};
