-- Step 1: Add `file_id` column without NOT NULL constraint
ALTER TABLE "embeddings" ADD COLUMN "file_id" varchar(191);
ALTER TABLE "resources" ADD COLUMN "file_id" varchar(191);

-- Step 2: Populate `file_id` with a default or mapped value for existing rows
-- Ensure a default file exists in the `files` table
INSERT INTO "files" ("id", "file_title", "source_url", "uploaded_at")
VALUES ('default-file-id', 'Default File Title', NULL, NOW())
ON CONFLICT ("id") DO NOTHING;

-- Update existing rows in `embeddings` and `resources` with the default `file_id`
UPDATE "embeddings" SET "file_id" = 'default-file-id' WHERE "file_id" IS NULL;
UPDATE "resources" SET "file_id" = 'default-file-id' WHERE "file_id" IS NULL;

-- Step 3: Apply NOT NULL constraints to `file_id`
ALTER TABLE "embeddings" ALTER COLUMN "file_id" SET NOT NULL;
ALTER TABLE "resources" ALTER COLUMN "file_id" SET NOT NULL;

-- Step 4: Add foreign key constraints
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_file_id_fkey"
FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE CASCADE;

ALTER TABLE "resources" ADD CONSTRAINT "resources_file_id_fkey"
FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE CASCADE;