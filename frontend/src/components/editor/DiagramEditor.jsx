
"use client";
import ShapeNode from "./ShapeNode";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { API } from "@/constants/api";
const nodeTypes = {
  shape: ShapeNode,
};
export default function DiagramEditor({ diagramId }) {
  const [diagram, setDiagram] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
    const addShape = useCallback(
  (shape) => {
    const newNode = {
      id: crypto.randomUUID(),
      type: "shape",
      position: {
        x: 150 + nodes.length * 30,
        y: 100 + nodes.length * 30,
      },
      data: {
        shape,
        label: shape.charAt(0).toUpperCase() + shape.slice(1),
      },
    };

    setNodes((currentNodes) => [...currentNodes, newNode]);
    setSaveMessage("");
  },
  [nodes.length, setNodes]
);
  useEffect(() => {
    const controller = new AbortController();

    async function loadDiagram() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API.GET_DIAGRAM(diagramId), {
          credentials: "include",
          signal: controller.signal,
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load diagram."
          );
        }

        if (
          !result.success ||
          !result.data ||
          !Array.isArray(result.data.nodes) ||
          !Array.isArray(result.data.edges)
        ) {
          throw new Error("Invalid diagram data received.");
        }

        setDiagram(result.data);
        setNodes(result.data.nodes);
        setEdges(result.data.edges);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Unable to load diagram.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDiagram();

    return () => controller.abort();
  }, [diagramId, setNodes, setEdges]);

  // Create connections between nodes
  const onConnect = useCallback(
    (connection) => {
      setEdges((currentEdges) =>
        addEdge(connection, currentEdges)
      );
      setSaveMessage("");
    },
    [setEdges]
  );

  // Save diagram to PostgreSQL
  async function handleSave() {
    try {
      setSaving(true);
      setSaveMessage("");
      setError(null);

      const response = await fetch(API.UPDATE_DIAGRAM(diagramId), {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nodes,
          edges,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to save diagram."
        );
      }

      setDiagram(result.data);
      setSaveMessage("All changes saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading diagram...</p>
      </main>
    );
  }

  if (error && !diagram) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900">
          Unable to open diagram
        </h1>
        <p className="max-w-md text-gray-600">{error}</p>
        <Link
          href="/workspace"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white"
        >
          Back to workspace
        </Link>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col bg-gray-50">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <Link
            href={`/diagrams/${diagramId}`}
            className="text-sm text-indigo-600"
          >
            Back to details
          </Link>

          <h1 className="mt-1 text-xl font-bold text-gray-900">
            {diagram.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="text-sm text-green-600">
              {saveMessage}
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </header>

      {error && (
        <div className="border-b border-red-200 bg-red-50 px-6 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
        <div className="flex flex-wrap items-center gap-2 border-b bg-white px-5 py-3">
  <span className="mr-2 text-sm font-semibold text-gray-600">
    Shapes:
  </span>

  {["rectangle", "rounded", "circle", "diamond", "parallelogram"].map(
    (shape) => (
      <button
        key={shape}
        type="button"
        onClick={() => addShape(shape)}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm capitalize text-gray-700 hover:border-indigo-500 hover:bg-indigo-50"
      >
        + {shape}
      </button>
    )
  )}
</div>
      <div className="min-h-0 flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodesDraggable
          nodesConnectable
          elementsSelectable
          edgesReconnectable
          deleteKeyCode={["Backspace", "Delete"]}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </main>
  );
}
