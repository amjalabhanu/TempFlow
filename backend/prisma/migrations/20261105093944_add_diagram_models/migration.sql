-- CreateEnum
CREATE TYPE "DiagramVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "CollaboratorRole" AS ENUM ('VIEWER', 'EDITOR');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "diagrams" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled Diagram',
    "description" TEXT,
    "nodes" JSONB NOT NULL DEFAULT '[]',
    "edges" JSONB NOT NULL DEFAULT '[]',
    "ownerId" TEXT NOT NULL,
    "visibility" "DiagramVisibility" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagrams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagram_collaborators" (
    "id" TEXT NOT NULL,
    "diagramId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "CollaboratorRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diagram_collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagram_invitations" (
    "id" TEXT NOT NULL,
    "diagramId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT,
    "email" TEXT NOT NULL,
    "role" "CollaboratorRole" NOT NULL DEFAULT 'VIEWER',
    "token" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diagram_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "diagrams_ownerId_idx" ON "diagrams"("ownerId");

-- CreateIndex
CREATE INDEX "diagrams_visibility_idx" ON "diagrams"("visibility");

-- CreateIndex
CREATE INDEX "diagram_collaborators_userId_idx" ON "diagram_collaborators"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "diagram_collaborators_diagramId_userId_key" ON "diagram_collaborators"("diagramId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "diagram_invitations_token_key" ON "diagram_invitations"("token");

-- CreateIndex
CREATE INDEX "diagram_invitations_email_idx" ON "diagram_invitations"("email");

-- CreateIndex
CREATE INDEX "diagram_invitations_diagramId_idx" ON "diagram_invitations"("diagramId");

-- AddForeignKey
ALTER TABLE "diagrams" ADD CONSTRAINT "diagrams_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagram_collaborators" ADD CONSTRAINT "diagram_collaborators_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "diagrams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagram_collaborators" ADD CONSTRAINT "diagram_collaborators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagram_invitations" ADD CONSTRAINT "diagram_invitations_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "diagrams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagram_invitations" ADD CONSTRAINT "diagram_invitations_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagram_invitations" ADD CONSTRAINT "diagram_invitations_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
