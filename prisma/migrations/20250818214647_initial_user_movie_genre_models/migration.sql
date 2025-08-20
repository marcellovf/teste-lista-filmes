/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `durationMins` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `posterUrl` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `release_date` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vote_average` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Movie" DROP COLUMN "createdAt",
DROP COLUMN "durationMins",
DROP COLUMN "genre",
DROP COLUMN "posterUrl",
DROP COLUMN "releaseDate",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "poster_path" TEXT,
ADD COLUMN     "release_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vote_average" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Movie_id_seq";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "name";

-- CreateTable
CREATE TABLE "public"."Genre" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_MovieToGenre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MovieToGenre_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "public"."Genre"("name");

-- CreateIndex
CREATE INDEX "_MovieToGenre_B_index" ON "public"."_MovieToGenre"("B");
