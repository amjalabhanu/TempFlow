import AppShell from "@/components/layout/AppShell";
import GalleryPage from "@/components/diagrams/GalleryPage";

export default async function PublishedPage({ searchParams }) {
  const params = await searchParams;

  return (
    <AppShell activePath="/published">
      <GalleryPage
        scope="published"
        title="Published diagrams"
        description="Explore ideas, templates, and visual systems shared by the FlowSpace community."
        initialDemoError={params.demo === "error"}
      />
    </AppShell>
  );
}
