import AppShell from "@/components/layout/AppShell";
import GalleryPage from "@/components/diagrams/GalleryPage";

export default async function WorkspacePage({ searchParams }) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";

  return (
    <AppShell activePath="/workspace">
      <GalleryPage
        scope="workspace"
        title="My workspace"
        description="Keep your active diagrams, drafts, and local demo work in one focused place."
        initialSearch={search}
        initialDemoError={params.demo === "error"}
      />
    </AppShell>
  );
}
