"use client";

import { createContext, useContext, useState } from "react";
import { mockDiagrams } from "@/data/mockDiagrams";

const DemoWorkspaceContext = createContext(null);

function cloneDiagram(diagram) {
  return {
    ...diagram,
    collaborators: [...(diagram.collaborators || [])],
    tags: [...(diagram.tags || [])],
  };
}

export function DemoWorkspaceProvider({ children }) {
  const [diagrams, setDiagrams] = useState(() => mockDiagrams.map(cloneDiagram));

  function findDiagram(diagramId) {
    return diagrams.find((diagram) => diagram.id === diagramId);
  }

  function updateDiagram(diagramId, changes) {
    setDiagrams((current) =>
      current.map((diagram) =>
        diagram.id === diagramId ? { ...diagram, ...changes } : diagram,
      ),
    );
  }

  function toggleFavorite(diagramId) {
    const diagram = findDiagram(diagramId);
    if (diagram) {
      updateDiagram(diagramId, { favorite: !diagram.favorite });
    }
  }

  function moveToTrash(diagramId) {
    updateDiagram(diagramId, { trashed: true, favorite: false });
  }

  function restoreDiagram(diagramId) {
    updateDiagram(diagramId, { trashed: false });
  }

  function deletePermanently(diagramId) {
    setDiagrams((current) => current.filter((diagram) => diagram.id !== diagramId));
  }

  function emptyTrash() {
    setDiagrams((current) => current.filter((diagram) => !diagram.trashed));
  }

  function duplicateDiagram(diagramId) {
    const source = findDiagram(diagramId);

    if (!source) return null;

    const copyId = `${source.id}-copy-${Date.now()}`;
    const copy = {
      ...cloneDiagram(source),
      id: copyId,
      title: `${source.title} copy`,
      updatedAt: "Just now",
      updatedAtValue: Date.now(),
      favorite: false,
      trashed: false,
      published: false,
      sharedWithMe: false,
      owner: "me",
      ownerName: "You",
    };

    setDiagrams((current) => [copy, ...current]);
    return copy;
  }

  function createDiagram({ title, category, description }) {
    const id = `${title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "untitled-diagram"}-${Date.now()}`;
    const newDiagram = {
      id,
      title: title.trim() || "Untitled diagram",
      category,
      description:
        description.trim() || "A new diagram created in the FlowSpace demo.",
      type: "flowchart",
      accent: "indigo",
      preview: "flow",
      owner: "me",
      ownerName: "You",
      ownerInitials: "Y",
      collaborators: [],
      collaboratorCount: 0,
      updatedAt: "Just now",
      updatedAtValue: Date.now(),
      createdAt: "Today",
      tags: [category, "New"],
      favorite: false,
      published: false,
      sharedWithMe: false,
      trashed: false,
      isPrivate: true,
      nodes: 6,
      connections: 5,
    };

    setDiagrams((current) => [newDiagram, ...current]);
    return newDiagram;
  }

  const value = {
    diagrams,
    findDiagram,
    toggleFavorite,
    moveToTrash,
    restoreDiagram,
    deletePermanently,
    emptyTrash,
    duplicateDiagram,
    createDiagram,
  };

  return (
    <DemoWorkspaceContext.Provider value={value}>
      {children}
    </DemoWorkspaceContext.Provider>
  );
}

export function useDemoWorkspace() {
  const context = useContext(DemoWorkspaceContext);

  if (!context) {
    throw new Error("useDemoWorkspace must be used within DemoWorkspaceProvider");
  }

  return context;
}
