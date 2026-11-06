import { DiagramGridSkeleton } from "@/components/diagrams/CollectionStates";

export default function WorkspaceLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-5 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-8 w-52 animate-pulse rounded bg-gray-200" />
        <div className="h-24 animate-pulse rounded-2xl bg-white" />
        <DiagramGridSkeleton />
      </div>
    </div>
  );
}
