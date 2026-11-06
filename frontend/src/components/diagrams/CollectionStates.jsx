import Link from "next/link";
import { AlertTriangle, FolderOpen, Plus, RefreshCw } from "lucide-react";

export function DiagramSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="h-40 animate-pulse bg-gray-100" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}

export function DiagramGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <DiagramSkeleton key={index} />
      ))}
    </div>
  );
}

export function EmptyState({ title, description, actionLabel, actionHref, onAction }) {
  const buttonClass = "inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700";

  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <FolderOpen size={27} />
      </div>
      <h2 className="mt-5 text-lg font-bold text-gray-900">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className={`mt-6 ${buttonClass}`}>
          <Plus size={17} />
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className={`mt-6 ${buttonClass}`}>
          <Plus size={17} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/50 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
        <AlertTriangle size={27} />
      </div>
      <h2 className="mt-5 text-lg font-bold text-gray-900">We could not load these diagrams</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        This is a local demo error state. No request was sent outside your browser.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50"
      >
        <RefreshCw size={17} />
        Try again
      </button>
    </div>
  );
}
