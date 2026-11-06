import AppShell from "@/components/layout/AppShell";
import GalleryPage from "@/components/diagrams/GalleryPage";

export default function PrivateWorkspacePage() {
  return (
    <AppShell activePath="/workspace/private">
      <GalleryPage
        scope="private"
        title="Private diagrams"
        description="Personal drafts and diagrams that stay visible only to you and selected collaborators."
      />
    </AppShell>
  );
}
