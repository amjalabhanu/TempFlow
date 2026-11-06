import AppShell from "@/components/layout/AppShell";
import GalleryPage from "@/components/diagrams/GalleryPage";

export default function FavoritesPage() {
  return (
    <AppShell activePath="/favorites">
      <GalleryPage
        scope="favorites"
        title="Favorites"
        description="Your saved diagrams, ready to revisit whenever you need a useful reference."
      />
    </AppShell>
  );
}
