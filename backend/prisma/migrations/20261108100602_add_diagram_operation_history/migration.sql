-- AlterTable
ALTER TABLE "diagrams" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "diagram_operations" (
    "id" TEXT NOT NULL,
    "diagramId" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diagram_operations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "diagram_operations_diagramId_idx" ON "diagram_operations"("diagramId");

-- CreateIndex
CREATE UNIQUE INDEX "diagram_operations_diagramId_operationId_key" ON "diagram_operations"("diagramId", "operationId");

-- CreateIndex
CREATE UNIQUE INDEX "diagram_operations_diagramId_sequence_key" ON "diagram_operations"("diagramId", "sequence");

-- AddForeignKey
ALTER TABLE "diagram_operations" ADD CONSTRAINT "diagram_operations_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "diagrams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
