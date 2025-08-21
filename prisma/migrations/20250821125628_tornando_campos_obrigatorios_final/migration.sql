/*
  Warnings:

  - Made the column `overview` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `release_date` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `original_title` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `budget` on table `Movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Movie" ALTER COLUMN "overview" SET NOT NULL,
ALTER COLUMN "release_date" SET NOT NULL,
ALTER COLUMN "original_title" SET NOT NULL,
ALTER COLUMN "budget" SET NOT NULL;
