"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Copy,
  FolderOpen,
  Globe2,
  Heart,
  LockKeyhole,
  Network,
  Share2,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { getMockDiagramById } from "@/data/mockDiagrams";
import { useDemoAuth } from "@/context/DemoAuthContext";
import { useDemoWorkspace } from "@/context/DemoWorkspaceContext";
import { useFlowShell } from "@/components/layout/AppShell";
import DiagramCarousel from "./DiagramCarousel";
import DiagramPreview from "./DiagramPreview";

function NotFoundDiagram() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <FolderOpen size={30} />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">This diagram is not in the demo library</h1>
      <p className="mt-3 text-sm leading-6 text-gray-500">
        It may have been permanently deleted during this browser session.
      </p>
      <Link href="/published" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
        Browse diagrams
      </Link>
    </div>
  );
}

export default function DiagramDetail({ diagramId }) {
  const router = useRouter();
  const { isAuthenticated } = useDemoAuth();
  const { diagrams, duplicateDiagram, findDiagram, moveToTrash, toggleFavorite } = useDemoWorkspace();
  const { requestLogin } = useFlowShell();
  const [activeTab, setActiveTab] = useState("overview");
  const [shareNotice, setShareNotice] = useState("");
  const diagram = findDiagram(diagramId) || getMockDiagramById(diagramId);

  const relatedDiagrams = useMemo(() => {
    if (!diagram) return [];
    return diagrams
      .filter((candidate) => (
        candidate.id !== diagram.id
        && !candidate.trashed
        && (candidate.category === diagram.category || candidate.published)
      ))
      .slice(0, 4);
  }, [diagram, diagrams]);

  if (!diagram) return <NotFoundDiagram />;

  function requireAuth(callback) {
    if (!isAuthenticated) {
      requestLogin();
      return;
    }
    callback();
  }

  function handleDuplicate() {
    requireAuth(() => {
      const copy = duplicateDiagram(diagram.id);
      if (copy) router.push(`/diagrams/${copy.id}`);
    });
  }

  function handleTrash() {
    requireAuth(() => {
      moveToTrash(diagram.id);
      router.push("/trash");
    });
  }

  async function handleShare() {
    if (!isAuthenticated) {
      requestLogin();
      return;
    }

    try {
      await navigator.clipboard?.writeText(window.location.href);
      setShareNotice("Share link copied to your clipboard.");
    } catch {
      setShareNotice("This local demo is ready to share.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href={diagram.published ? "/published" : "/workspace"} className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-indigo-600">
          <ArrowLeft size={17} />
          Back to diagrams
        </Link>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => requireAuth(() => toggleFavorite(diagram.id))}
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${
              diagram.favorite
                ? "border-rose-200 bg-rose-50 text-rose-600"
                : "border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:text-rose-600"
            }`}
          >
            <Star size={16} className={diagram.favorite ? "fill-rose-500" : ""} />
            {diagram.favorite ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={handleDuplicate}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            <Copy size={16} />
            Duplicate
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      {shareNotice && (
        <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {shareNotice}
        </p>
      )}

      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <DiagramPreview diagram={diagram} size="large" />
      </section>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">{diagram.category}</span>
                {diagram.published ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><Globe2 size={13} />Published</span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600"><LockKeyhole size={13} />Private</span>
                )}
              </div>
              <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">{diagram.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">{diagram.description}</p>
            </div>
            {diagram.favorite && <Heart size={22} className="fill-rose-500 text-rose-500" />}
          </div>

          <div className="mt-7 flex gap-5 border-b border-gray-100" role="tablist" aria-label="Diagram information">
            {[
              ["overview", "Overview"],
              ["activity", "Activity"],
            ].map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                  activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === "overview" ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <Network size={19} className="text-indigo-600" />
                <p className="mt-3 text-sm font-semibold text-gray-900">{diagram.nodes} nodes · {diagram.connections} connections</p>
                <p className="mt-1 text-sm text-gray-500">Built as a local interactive demo canvas.</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <CalendarDays size={19} className="text-indigo-600" />
                <p className="mt-3 text-sm font-semibold text-gray-900">Created {diagram.createdAt}</p>
                <p className="mt-1 text-sm text-gray-500">{diagram.updatedAt}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {diagram.tags?.map((tag) => <span key={tag} className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700">{tag}</span>)}
                </div>
              </div>
            </div>
          ) : (
            <ol className="mt-6 space-y-5 border-l border-gray-200 pl-5">
              <li className="relative text-sm text-gray-600"><span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500" /><strong className="text-gray-900">You</strong> updated the diagram <span className="text-gray-400">{diagram.updatedAt.toLowerCase()}</span></li>
              <li className="relative text-sm text-gray-600"><span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-gray-300" /><strong className="text-gray-900">{diagram.ownerName}</strong> created this diagram <span className="text-gray-400">on {diagram.createdAt}</span></li>
            </ol>
          )}
        </section>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Owner</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">{diagram.ownerInitials}</div>
              <div className="min-w-0"><p className="truncate text-sm font-semibold text-gray-900">{diagram.ownerName}</p><p className="text-xs text-gray-500">Diagram owner</p></div>
            </div>
          </section>
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Collaborators</p><Users size={17} className="text-gray-400" /></div>
            <div className="mt-4 flex -space-x-2">
              {(diagram.collaborators?.length ? diagram.collaborators : [diagram.ownerName]).slice(0, 4).map((person) => <span key={person} title={person} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-xs font-bold text-indigo-700">{person.charAt(0)}</span>)}
              {diagram.collaboratorCount > 4 && <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-semibold text-gray-600">+{diagram.collaboratorCount - 4}</span>}
            </div>
            <p className="mt-3 text-sm text-gray-500">{diagram.collaboratorCount} people can view this diagram.</p>
          </section>
          {isAuthenticated && diagram.owner === "me" && (
            <button type="button" onClick={handleTrash} className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"><Trash2 size={17} />Move to trash</button>
          )}
        </aside>
      </div>

      <section className="pt-3">
        <div className="mb-5"><p className="text-sm font-semibold text-indigo-600">Keep exploring</p><h2 className="mt-1 text-xl font-bold text-gray-900">Related diagrams</h2></div>
        <DiagramCarousel diagrams={relatedDiagrams} ariaLabel="Related diagrams" emptyMessage="No related diagrams in this local demo yet." />
      </section>
    </div>
  );
}
