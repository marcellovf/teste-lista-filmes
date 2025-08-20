/*
  Warnings:

  - You are about to drop the column `release_date` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `vote_average` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `durationInMinutes` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `release_year` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Movie" DROP COLUMN "release_date",
DROP COLUMN "vote_average",
ADD COLUMN     "durationInMinutes" INTEGER NOT NULL,
ADD COLUMN     "release_year" INTEGER NOT NULL;
