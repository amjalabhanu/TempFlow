import AppShell from "@/components/layout/AppShell";
import GalleryPage from "@/components/diagrams/GalleryPage";

export default function TrashPage() {
  return (
    <AppShell activePath="/trash">
      <GalleryPage
        scope="trash"
        title="Trash"
        description="Restore a deleted diagram or remove it permanently from this browser-only demo."
      />
    </AppShell>
  );
}
