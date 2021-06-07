/*
  Warnings:

  - Added the required column `name` to the `Scene` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scene" ADD COLUMN     "name" TEXT NOT NULL;
