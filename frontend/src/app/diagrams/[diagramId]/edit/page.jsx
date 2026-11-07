
import DiagramEditor from "@/components/editor/DiagramEditor";

export default async function EditDiagramPage({ params }) {
  const { diagramId } = await params;

  return <DiagramEditor diagramId={diagramId} />;
}
