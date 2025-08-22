-- AlterTable
ALTER TABLE "public"."Movie" ADD COLUMN     "addedById" INTEGER,
ADD COLUMN     "sent" BOOLEAN DEFAULT false,
ALTER COLUMN "durationInMinutes" DROP NOT NULL,
ALTER COLUMN "overview" DROP NOT NULL,
ALTER COLUMN "release_date" DROP NOT NULL,
ALTER COLUMN "original_title" DROP NOT NULL,
ALTER COLUMN "budget" DROP NOT NULL;
