/*
  Warnings:

  - Added the required column `authorId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
TRUNCATE TABLE "ChatMessage";

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PlayerInWorld" ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "World" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD FOREIGN KEY ("authorId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
