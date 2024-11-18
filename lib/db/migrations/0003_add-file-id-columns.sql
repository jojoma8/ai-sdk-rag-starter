-- Step 1: Add `file_id` column without NOT NULL constraint, only if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'embeddings'
        AND column_name = 'file_id'
    ) THEN
        ALTER TABLE "embeddings" ADD COLUMN "file_id" varchar(191);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'resources'
        AND column_name = 'file_id'
    ) THEN
        ALTER TABLE "resources" ADD COLUMN "file_id" varchar(191);
    END IF;
END $$;

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

-- Step 4: Add foreign key constraints, only if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_name = 'embeddings'
        AND constraint_name = 'embeddings_file_id_fkey'
    ) THEN
        ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_file_id_fkey"
        FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_name = 'resources'
        AND constraint_name = 'resources_file_id_fkey'
    ) THEN
        ALTER TABLE "resources" ADD CONSTRAINT "resources_file_id_fkey"
        FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE CASCADE;
    END IF;
END $$;