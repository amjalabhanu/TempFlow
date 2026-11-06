"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Plus, RefreshCw } from "lucide-react";
import { diagramCategories } from "@/data/mockDiagrams";
import { useDemoAuth } from "@/context/DemoAuthContext";
import { useDemoWorkspace } from "@/context/DemoWorkspaceContext";
import { useFlowShell } from "@/components/layout/AppShell";
import DiagramFilters from "./DiagramFilters";
import DiagramGrid from "./DiagramGrid";

const scopeRules = {
  workspace: (diagram) => diagram.owner === "me" && !diagram.trashed,
  recent: (diagram) => diagram.owner === "me" && !diagram.trashed,
  private: (diagram) => diagram.owner === "me" && diagram.isPrivate && !diagram.trashed,
  published: (diagram) => diagram.published && !diagram.trashed,
  shared: (diagram) => diagram.sharedWithMe && !diagram.trashed,
  favorites: (diagram) => diagram.favorite && !diagram.trashed,
  trash: (diagram) => diagram.trashed,
};

const managedScopes = new Set(["workspace", "recent", "private", "favorites", "trash"]);

function GuestGate() {
  const { requestLogin } = useFlowShell();

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-20 text-center sm:py-28">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
        <LockKeyhole size={30} />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">Your workspace is ready when you are</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
        Sign in to open the local FlowSpace demo workspace, manage favorites, and see diagrams shared with you.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={requestLogin}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Open demo workspace
          <ArrowRight size={17} />
        </button>
        <Link
          href="/published"
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Browse published diagrams
        </Link>
      </div>
    </div>
  );
}

export default function GalleryPage({
  scope = "workspace",
  title,
  description,
  initialSearch = "",
  initialDemoError = false,
}) {
  const { isAuthenticated } = useDemoAuth();
  const {
    diagrams,
    deletePermanently,
    duplicateDiagram,
    emptyTrash,
    moveToTrash,
    restoreDiagram,
    toggleFavorite,
  } = useDemoWorkspace();
  const { requestCreateDiagram } = useFlowShell();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(!initialDemoError);
  const [error, setError] = useState(initialDemoError);

  useEffect(() => {
    if (initialDemoError) return undefined;

    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, [initialDemoError]);

  const visibleDiagrams = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    const matchesScope = scopeRules[scope] || scopeRules.workspace;
    const scoped = diagrams.filter(matchesScope);
    const filtered = scoped.filter((diagram) => {
      const categoryMatches = activeCategory === "all" || diagram.category === activeCategory;
      const text = `${diagram.title} ${diagram.description} ${diagram.tags?.join(" ") || ""}`.toLowerCase();
      return categoryMatches && (!lowerSearch || text.includes(lowerSearch));
    });

    return [...filtered].sort((first, second) => {
      if (sort === "name") return first.title.localeCompare(second.title);
      if (sort === "oldest") return (first.updatedAtValue || 0) - (second.updatedAtValue || 0);
      return (second.updatedAtValue || 0) - (first.updatedAtValue || 0);
    });
  }, [activeCategory, diagrams, scope, search, sort]);

  if (!isAuthenticated && scope !== "published") {
    return <GuestGate />;
  }

  function retryLoading() {
    setError(false);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 420);
  }

  const isTrash = scope === "trash";
  const canManage = isAuthenticated && managedScopes.has(scope);
  const emptyCopy = isTrash
    ? {
        title: "Trash is empty",
        description: "Deleted diagrams will stay here until you restore or permanently remove them.",
      }
    : search || activeCategory !== "all"
      ? {
          title: "No diagrams match those filters",
          description: "Try a different search term or clear a category to see more local demo diagrams.",
        }
      : {
          title: "No diagrams here yet",
          description: "Create a new diagram or explore the published collection for inspiration.",
          actionLabel: scope === "published" ? undefined : "Create a diagram",
          onAction: scope === "published" ? undefined : requestCreateDiagram,
        };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600">FlowSpace library</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">{description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isTrash && visibleDiagrams.length > 0 && !loading && !error && (
            <button
              type="button"
              onClick={emptyTrash}
              className="rounded-xl border border-red-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Empty trash
            </button>
          )}
          {isAuthenticated && scope !== "published" && (
            <button
              type="button"
              onClick={requestCreateDiagram}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Plus size={17} />
              New diagram
            </button>
          )}
          {initialDemoError && (
            <button
              type="button"
              onClick={retryLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <RefreshCw size={16} />
              Retry demo state
            </button>
          )}
        </div>
      </div>

      <DiagramFilters
        categories={diagramCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
      />

      {!loading && !error && (
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-700">{visibleDiagrams.length}</span>{" "}
          {visibleDiagrams.length === 1 ? "diagram" : "diagrams"}
        </p>
      )}

      <DiagramGrid
        diagrams={visibleDiagrams}
        loading={loading}
        error={error}
        onRetry={retryLoading}
        empty={emptyCopy}
        showActions={canManage}
        actionMode={isTrash ? "trash" : "workspace"}
        onFavorite={toggleFavorite}
        onTrash={moveToTrash}
        onRestore={restoreDiagram}
        onDelete={deletePermanently}
        onDuplicate={duplicateDiagram}
      />
    </div>
  );
}
