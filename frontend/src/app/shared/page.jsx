import AppShell from "@/components/layout/AppShell";
import GalleryPage from "@/components/diagrams/GalleryPage";

export default function SharedPage() {
  return (
    <AppShell activePath="/shared">
      <GalleryPage
        scope="shared"
        title="Shared with me"
        description="Diagrams teammates have invited you to view and contribute to in the demo workspace."
      />
    </AppShell>
  );
}
