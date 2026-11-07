"use client";

import Link from "next/link";
import {
  Clock3,
  Copy,
  Heart,
  RotateCcw,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import DiagramPreview from "./DiagramPreview";

export default function DiagramCard({
  diagram,
  showActions = false,
  actionMode = "workspace",
  onFavorite,
  onTrash,
  onRestore,
  onDelete,
  onDuplicate,
}) {
  const isTrash = actionMode === "trash";

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <Link href={`/diagrams/${diagram.id}/edit`} className="block focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
        <DiagramPreview diagram={diagram} />
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {diagram.category}
            </span>
            <Link
              href={`/diagrams/${diagram.id}/edit`}
              className="mt-1 block truncate font-bold text-gray-900 outline-none hover:text-indigo-700 focus:text-indigo-700"
            >
              {diagram.title}
            </Link>
          </div>

          {diagram.favorite && !isTrash && (
            <Heart size={17} className="mt-1 shrink-0 fill-rose-500 text-rose-500" aria-label="Favorite" />
          )}
        </div>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
          {diagram.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 text-xs text-gray-400">
          <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
            <Clock3 size={14} />
            {isTrash ? "Moved to trash" : diagram.updatedAt}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5">
            <Users size={14} />
            {diagram.collaboratorCount || 1}
          </span>
        </div>

        {showActions && (
          <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
            {isTrash ? (
              <>
                <button
                  type="button"
                  onClick={() => onRestore?.(diagram.id)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                >
                  <RotateCcw size={14} />
                  Restore
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(diagram.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                  aria-label={`Delete ${diagram.title} permanently`}
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onFavorite?.(diagram.id)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
                    diagram.favorite
                      ? "bg-rose-50 text-rose-500"
                      : "text-gray-400 hover:bg-gray-100 hover:text-rose-500"
                  }`}
                  aria-label={diagram.favorite ? `Remove ${diagram.title} from favorites` : `Add ${diagram.title} to favorites`}
                >
                  <Star size={16} className={diagram.favorite ? "fill-rose-500" : ""} />
                </button>
                <button
                  type="button"
                  onClick={() => onDuplicate?.(diagram.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-indigo-600"
                  aria-label={`Duplicate ${diagram.title}`}
                >
                  <Copy size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onTrash?.(diagram.id)}
                  className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  aria-label={`Move ${diagram.title} to trash`}
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
