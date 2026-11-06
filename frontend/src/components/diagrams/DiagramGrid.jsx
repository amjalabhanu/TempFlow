import DiagramCard from "./DiagramCard";
import { DiagramGridSkeleton, EmptyState, ErrorState } from "./CollectionStates";

export default function DiagramGrid({
  diagrams,
  loading,
  error,
  onRetry,
  empty,
  showActions,
  actionMode,
  onFavorite,
  onTrash,
  onRestore,
  onDelete,
  onDuplicate,
}) {
  if (loading) return <DiagramGridSkeleton />;
  if (error) return <ErrorState onRetry={onRetry} />;
  if (!diagrams.length) return <EmptyState {...empty} />;

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {diagrams.map((diagram) => (
        <DiagramCard
          key={diagram.id}
          diagram={diagram}
          showActions={showActions}
          actionMode={actionMode}
          onFavorite={onFavorite}
          onTrash={onTrash}
          onRestore={onRestore}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
}
