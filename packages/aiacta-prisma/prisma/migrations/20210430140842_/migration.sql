/*
  Warnings:

  - Added the required column `creatorId` to the `World` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "World" ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "inviteOnly" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "joinKey" TEXT,
ADD COLUMN     "password" TEXT;

-- CreateTable
CREATE TABLE "_PlayerToWorld" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PlayerToWorld_AB_unique" ON "_PlayerToWorld"("A", "B");

-- CreateIndex
CREATE INDEX "_PlayerToWorld_B_index" ON "_PlayerToWorld"("B");

-- AddForeignKey
ALTER TABLE "_PlayerToWorld" ADD FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToWorld" ADD FOREIGN KEY ("B") REFERENCES "World"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "World" ADD FOREIGN KEY ("creatorId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
