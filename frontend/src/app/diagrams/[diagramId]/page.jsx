import AppShell from "@/components/layout/AppShell";
import DiagramDetail from "@/components/diagrams/DiagramDetail";
import { mockDiagrams } from "@/data/mockDiagrams";

export function generateStaticParams() {
  return mockDiagrams.map((diagram) => ({ diagramId: diagram.id }));
}

export default async function DiagramPage({ params }) {
  const { diagramId } = await params;

  return (
    <AppShell activePath="">
      <DiagramDetail diagramId={diagramId} />
    </AppShell>
  );
}
