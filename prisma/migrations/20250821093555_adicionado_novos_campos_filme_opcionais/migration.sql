-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "overview" TEXT,
ADD COLUMN     "release_date" TIMESTAMP(3),
ADD COLUMN     "original_title" TEXT,
ADD COLUMN     "budget" INTEGER,
DROP COLUMN "release_year";
