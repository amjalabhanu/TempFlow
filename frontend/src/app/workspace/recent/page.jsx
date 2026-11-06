import AppShell from "@/components/layout/AppShell";
import GalleryPage from "@/components/diagrams/GalleryPage";

export default function RecentWorkspacePage() {
  return (
    <AppShell activePath="/workspace/recent">
      <GalleryPage
        scope="recent"
        title="Recent diagrams"
        description="Pick up where you left off with diagrams you have been actively shaping."
      />
    </AppShell>
  );
}
