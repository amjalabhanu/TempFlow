
"use client";

import { Handle, Position } from "@xyflow/react";

export default function ShapeNode({ data, selected }) {
  const shape = data.shape || "rectangle";

  const baseStyle = {
    minWidth: 130,
    minHeight: 65,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    background: data.background || "#eef2ff",
    border: `${selected ? 3 : 2}px solid ${data.borderColor || "#6366f1"}`,
    color: data.textColor || "#1e1b4b",
    fontSize: data.fontSize || 14,
    fontWeight: 600,
    textAlign: "center",
    position: "relative",
  };

  const shapeStyles = {
    rectangle: { borderRadius: 8 },
    rounded: { borderRadius: 40 },
    circle: {
      width: 110,
      height: 110,
      minWidth: 110,
      minHeight: 110,
      borderRadius: "50%",
    },
    diamond: {
      width: 105,
      height: 105,
      minWidth: 105,
      minHeight: 105,
      transform: "rotate(45deg)",
      borderRadius: 5,
    },
    parallelogram: {
      transform: "skew(-15deg)",
      borderRadius: 4,
    },
  };

  return (
    <div style={{ position: "relative" }}>
      <Handle type="target" position={Position.Top} />

      <div style={{ ...baseStyle, ...shapeStyles[shape] }}>
        <span
          style={{
            transform:
              shape === "diamond"
                ? "rotate(-45deg)"
                : shape === "parallelogram"
                  ? "skew(15deg)"
                  : "none",
          }}
        >
          {data.label || "New shape"}
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  );
}
