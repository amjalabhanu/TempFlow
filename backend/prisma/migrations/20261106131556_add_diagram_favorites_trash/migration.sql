-- AlterTable
ALTER TABLE "diagrams" ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trashed" BOOLEAN NOT NULL DEFAULT false;
