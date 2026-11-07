
"use client";

export default function DiagramPreview({ diagram, size = "card" }) {
  const nodes = Array.isArray(diagram.nodes) ? diagram.nodes : [];
  const edges = Array.isArray(diagram.edges) ? diagram.edges : [];

  const isLarge = size === "large";
  const height = isLarge ? "h-72 sm:h-96" : "h-40";

  if (!nodes.length) {
    return (
      <div className={`relative flex ${height} items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 to-violet-50`}>
        <div className="text-center">
          <p className="text-sm font-semibold text-indigo-600">
            Empty diagram
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Click to start editing
          </p>
        </div>
      </div>
    );
  }

  const nodeWidth = 150;
  const nodeHeight = 70;

  const minX = Math.min(...nodes.map((n) => n.position?.x || 0));
  const minY = Math.min(...nodes.map((n) => n.position?.y || 0));
  const maxX = Math.max(...nodes.map((n) => (n.position?.x || 0) + nodeWidth));
  const maxY = Math.max(...nodes.map((n) => (n.position?.y || 0) + nodeHeight));

  const padding = 60;
  const viewWidth = Math.max(maxX - minX + padding * 2, 300);
  const viewHeight = Math.max(maxY - minY + padding * 2, 180);

  const getCenter = (node) => ({
    x: (node.position?.x || 0) - minX + padding + nodeWidth / 2,
    y: (node.position?.y || 0) - minY + padding + nodeHeight / 2,
  });

  return (
    <div
      className={`group relative block ${height} overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50`}
    >
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern
            id={`grid-${diagram.id}`}
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="#cbd5e1" />
          </pattern>
        </defs>

        <rect
          width={viewWidth}
          height={viewHeight}
          fill={`url(#grid-${diagram.id})`}
        />

        {/* Connections */}
        {edges.map((edge) => {
          const source = nodes.find((n) => n.id === edge.source);
          const target = nodes.find((n) => n.id === edge.target);

          if (!source || !target) return null;

          const start = getCenter(source);
          const end = getCenter(target);

          return (
            <line
              key={edge.id}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={edge.style?.stroke || "#94a3b8"}
              strokeWidth="2.5"
            />
          );
        })}

        {/* Diagram nodes */}
        {nodes.map((node) => {
          const x = (node.position?.x || 0) - minX + padding;
          const y = (node.position?.y || 0) - minY + padding;

          const shape = node.data?.shape || "rectangle";
          const label = node.data?.label || node.data?.text || "Shape";

          const fill = node.data?.background || node.style?.background || "#eef2ff";
          const stroke = node.data?.borderColor || node.style?.borderColor || "#6366f1";

          return (
            <g key={node.id}>
              {shape === "circle" ? (
                <ellipse
                  cx={x + 75}
                  cy={y + 35}
                  rx="75"
                  ry="35"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2.5"
                />
              ) : shape === "diamond" ? (
                <polygon
                  points={`${x + 75},${y} ${x + 150},${y + 35} ${x + 75},${y + 70} ${x},${y + 35}`}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2.5"
                />
              ) : (
                <rect
                  x={x}
                  y={y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx={shape === "rounded" ? 35 : 8}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2.5"
                />
              )}

              <text
                x={x + 75}
                y={y + 35}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={node.data?.textColor || "#334155"}
                fontSize="12"
                fontWeight="600"
              >
                {label.length > 20 ? `${label.slice(0, 18)}...` : label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-2 right-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-indigo-600 shadow-sm opacity-0 transition group-hover:opacity-100">
        Click to edit →
      </div>

      <div className="pointer-events-none absolute bottom-2 left-2 rounded-full border border-white bg-white/90 px-2 py-1 text-[10px] font-medium text-slate-600 shadow-sm">
        {diagram.nodeCount} nodes
      </div>
    </div>
  );
}
