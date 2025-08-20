-- AlterTable
CREATE SEQUENCE "public".movie_id_seq;
ALTER TABLE "public"."Movie" ALTER COLUMN "id" SET DEFAULT nextval('"public".movie_id_seq');
ALTER SEQUENCE "public".movie_id_seq OWNED BY "public"."Movie"."id";
