
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { API } from "@/constants/api";
import { useDemoAuth } from "@/context/DemoAuthContext";

const DemoWorkspaceContext = createContext(null);

function formatDiagram(diagram, userId) {
  const category = diagram.category || "Flowchart";

  const previewMap = {
    Flowchart: "flow",
    Architecture: "architecture",
    "Mind map": "mindmap",
    Cloud: "cloud",
    Process: "process",
  };

  const accentMap = {
    Flowchart: "indigo",
    Architecture: "blue",
    "Mind map": "violet",
    Cloud: "emerald",
    Process: "amber",
  };

  return {
    ...diagram,
    category,
    description: diagram.description || "",
    preview: previewMap[category] || "flow",
    type: previewMap[category] || "flow",
    accent: accentMap[category] || "indigo",

    owner: diagram.ownerId === userId ? "me" : "shared",
    ownerName: diagram.ownerId === userId ? "You" : "Collaborator",
    ownerInitials: "Y",

    collaborators: diagram.collaborators || [],
    collaboratorCount: (diagram.collaborators || []).length + 1,

    updatedAt: diagram.updatedAt
      ? new Date(diagram.updatedAt).toLocaleDateString()
      : "Recently",

    updatedAtValue: diagram.updatedAt
      ? new Date(diagram.updatedAt).getTime()
      : Date.now(),

    createdAt: diagram.createdAt
      ? new Date(diagram.createdAt).toLocaleDateString()
      : "Recently",

    tags: [category],
    favorite: diagram.favorite ?? false,
    trashed: diagram.trashed ?? false,
    published: diagram.visibility === "PUBLIC",
    sharedWithMe: diagram.ownerId !== userId,
    isPrivate: diagram.visibility !== "PUBLIC",

    // Preserve actual diagram data for visual previews
    nodes: Array.isArray(diagram.nodes) ? diagram.nodes : [],
    edges: Array.isArray(diagram.edges) ? diagram.edges : [],

    // Keep separate counts for gallery cards
    nodeCount: Array.isArray(diagram.nodes) ? diagram.nodes.length : 0,
    connections: Array.isArray(diagram.edges) ? diagram.edges.length : 0,
  };
}

export function DemoWorkspaceProvider({ children }) {
  const { user, isAuthenticated, isReady } = useDemoAuth();

  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FETCH DIAGRAMS
  async function fetchDiagrams() {
    if (!isAuthenticated) {
      setDiagrams([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API.DIAGRAMS, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load diagrams.");
      }

      const formatted = result.data.map((diagram) =>
        formatDiagram(diagram, user?.id)
      );

      setDiagrams(formatted);
    } catch (err) {
      setError(err.message || "Unable to load diagrams.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isReady) return;

    fetchDiagrams();
  }, [isReady, isAuthenticated, user]);

  // FIND DIAGRAM
  function findDiagram(diagramId) {
    return diagrams.find((diagram) => diagram.id === diagramId);
  }

  // UPDATE DIAGRAM ON BACKEND
  async function updateDiagramOnServer(diagramId, changes) {
    try {
      const response = await fetch(API.UPDATE_DIAGRAM(diagramId), {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update diagram.");
      }

      setDiagrams((current) =>
        current.map((diagram) =>
          diagram.id === diagramId
            ? formatDiagram(result.data, user?.id)
            : diagram
        )
      );

      return true;
    } catch (err) {
      console.error("Diagram update failed:", err);
      alert(err.message || "Unable to update diagram.");
      return false;
    }
  }

  // FAVORITES
  async function toggleFavorite(diagramId) {
    const diagram = findDiagram(diagramId);

    if (!diagram) return false;

    return updateDiagramOnServer(diagramId, {
      favorite: !diagram.favorite,
    });
  }

  // MOVE TO TRASH
  async function moveToTrash(diagramId) {
    return updateDiagramOnServer(diagramId, {
      trashed: true,
      favorite: false,
    });
  }

  // RESTORE FROM TRASH
  async function restoreDiagram(diagramId) {
    return updateDiagramOnServer(diagramId, {
      trashed: false,
    });
  }

  // PERMANENT DELETE
  async function deletePermanently(diagramId) {
    try {
      const response = await fetch(API.DELETE_DIAGRAM(diagramId), {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete diagram.");
      }

      setDiagrams((current) =>
        current.filter((diagram) => diagram.id !== diagramId)
      );

      return true;
    } catch (err) {
      console.error("Delete diagram failed:", err);
      alert(err.message || "Unable to delete diagram.");
      return false;
    }
  }

  // EMPTY TRASH
  async function emptyTrash() {
    const trashedDiagrams = diagrams.filter((diagram) => diagram.trashed);

    const results = await Promise.allSettled(
      trashedDiagrams.map((diagram) =>
        fetch(API.DELETE_DIAGRAM(diagram.id), {
          method: "DELETE",
          credentials: "include",
        }).then(async (response) => {
          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.message || "Delete failed.");
          }

          return diagram.id;
        })
      )
    );

    const deletedIds = new Set(
      results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value)
    );

    setDiagrams((current) =>
      current.filter((diagram) => !deletedIds.has(diagram.id))
    );

    if (deletedIds.size !== trashedDiagrams.length) {
      alert("Some diagrams could not be permanently deleted.");
    }
  }

  // DUPLICATE DIAGRAM
  async function duplicateDiagram(diagramId) {
    try {
      const response = await fetch(API.DUPLICATE_DIAGRAM(diagramId), {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to duplicate diagram.");
      }

      const newDiagram = formatDiagram(result.data, user?.id);

      setDiagrams((current) => [newDiagram, ...current]);

      return newDiagram;
    } catch (err) {
      console.error("Duplicate diagram failed:", err);
      alert(err.message || "Unable to duplicate diagram.");
      return null;
    }
  }

  const value = {
    diagrams,
    loading,
    error,
    findDiagram,
    toggleFavorite,
    moveToTrash,
    restoreDiagram,
    deletePermanently,
    emptyTrash,
    duplicateDiagram,
    refreshDiagrams: fetchDiagrams,
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
    throw new Error(
      "useDemoWorkspace must be used within DemoWorkspaceProvider"
    );
  }

  return context;
}
