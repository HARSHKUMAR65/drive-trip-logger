-- Add an opaque identifier for URLs while keeping the primary key internal.
ALTER TABLE "Trip" ADD COLUMN "publicId" UUID;

UPDATE "Trip"
SET "publicId" = gen_random_uuid();

ALTER TABLE "Trip"
ALTER COLUMN "publicId" SET NOT NULL,
ALTER COLUMN "publicId" SET DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX "Trip_publicId_key" ON "Trip"("publicId");
