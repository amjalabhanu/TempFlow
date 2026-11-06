import {
  Cloud,
  GitBranch,
  Map,
  Network,
  Workflow,
} from "lucide-react";

const previewStyles = {
  indigo: {
    canvas: "from-indigo-50 via-white to-violet-50",
    line: "bg-indigo-200",
    node: "border-indigo-200 bg-white text-indigo-600",
    accent: "bg-indigo-500",
  },
  blue: {
    canvas: "from-blue-50 via-white to-cyan-50",
    line: "bg-blue-200",
    node: "border-blue-200 bg-white text-blue-600",
    accent: "bg-blue-500",
  },
  violet: {
    canvas: "from-violet-50 via-white to-fuchsia-50",
    line: "bg-violet-200",
    node: "border-violet-200 bg-white text-violet-600",
    accent: "bg-violet-500",
  },
  amber: {
    canvas: "from-amber-50 via-white to-orange-50",
    line: "bg-amber-200",
    node: "border-amber-200 bg-white text-amber-600",
    accent: "bg-amber-500",
  },
  emerald: {
    canvas: "from-emerald-50 via-white to-teal-50",
    line: "bg-emerald-200",
    node: "border-emerald-200 bg-white text-emerald-600",
    accent: "bg-emerald-500",
  },
  rose: {
    canvas: "from-rose-50 via-white to-pink-50",
    line: "bg-rose-200",
    node: "border-rose-200 bg-white text-rose-600",
    accent: "bg-rose-500",
  },
};

function PreviewIcon({ type, size = 24 }) {
  const icons = {
    architecture: Network,
    cloud: Cloud,
    flow: GitBranch,
    mindmap: Map,
    process: Workflow,
  };
  const Icon = icons[type] || Workflow;

  return <Icon size={size} strokeWidth={1.7} />;
}

export default function DiagramPreview({ diagram, size = "card" }) {
  const style = previewStyles[diagram.accent] || previewStyles.indigo;
  const isLarge = size === "large";
  const nodeClass = `absolute flex items-center justify-center rounded-lg border shadow-sm ${style.node}`;
  const canvasHeight = isLarge ? "h-72 sm:h-96" : "h-40";

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${style.canvas} ${canvasHeight}`}
      aria-label={`${diagram.title} diagram preview`}
      role="img"
    >
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(#c7d2fe_1px,transparent_1px)] [background-size:14px_14px]" />

      {diagram.preview === "mindmap" ? (
        <>
          <div className={`absolute left-1/2 top-1/2 h-0.5 w-24 -translate-x-full -translate-y-1/2 -rotate-25 ${style.line}`} />
          <div className={`absolute left-1/2 top-1/2 h-0.5 w-24 -translate-y-1/2 rotate-25 ${style.line}`} />
          <div className={`absolute left-1/2 top-1/2 h-0.5 w-20 -translate-x-1/2 -translate-y-1/2 rotate-90 ${style.line}`} />
          <div className={`${nodeClass} left-1/2 top-1/2 z-10 h-14 w-14 -translate-x-1/2 -translate-y-1/2 ${style.accent} border-0 text-white`}>
            <PreviewIcon type="mindmap" size={isLarge ? 32 : 23} />
          </div>
          <div className={`${nodeClass} left-[12%] top-[25%] h-9 w-20 text-[9px] font-semibold`}>Audience</div>
          <div className={`${nodeClass} right-[10%] top-[24%] h-9 w-20 text-[9px] font-semibold`}>Ideas</div>
          <div className={`${nodeClass} bottom-[16%] left-[17%] h-9 w-20 text-[9px] font-semibold`}>Goals</div>
          <div className={`${nodeClass} bottom-[15%] right-[14%] h-9 w-20 text-[9px] font-semibold`}>Actions</div>
        </>
      ) : (
        <>
          <div className={`absolute left-[23%] top-1/2 h-0.5 w-[22%] -translate-y-1/2 ${style.line}`} />
          <div className={`absolute left-[54%] top-1/2 h-0.5 w-[20%] -translate-y-1/2 ${style.line}`} />
          <div className={`absolute left-[42%] top-[35%] h-[30%] w-0.5 ${style.line}`} />
          <div className={`${nodeClass} left-[11%] top-1/2 h-11 w-[19%] -translate-y-1/2`}>
            <PreviewIcon type={diagram.preview} size={isLarge ? 26 : 18} />
          </div>
          <div className={`${nodeClass} left-[42%] top-[29%] h-11 w-[20%] -translate-x-1/2 -translate-y-1/2`}>
            <span className={`h-2.5 w-2.5 rounded-full ${style.accent}`} />
          </div>
          <div className={`${nodeClass} left-[42%] top-[71%] h-11 w-[20%] -translate-x-1/2 -translate-y-1/2`}>
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
          </div>
          <div className={`${nodeClass} right-[9%] top-1/2 h-12 w-[21%] -translate-y-1/2`}>
            <PreviewIcon type={diagram.preview} size={isLarge ? 27 : 19} />
          </div>
        </>
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-slate-500 shadow-sm backdrop-blur">
        <span className={`h-1.5 w-1.5 rounded-full ${style.accent}`} />
        {diagram.nodes || 8} nodes
      </div>
    </div>
  );
}
