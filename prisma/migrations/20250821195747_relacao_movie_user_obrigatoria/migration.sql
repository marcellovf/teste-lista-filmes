/*
  Warnings:

  - Made the column `addedById` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sent` on table `Movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Movie" ALTER COLUMN "addedById" SET NOT NULL,
ALTER COLUMN "sent" SET NOT NULL;
