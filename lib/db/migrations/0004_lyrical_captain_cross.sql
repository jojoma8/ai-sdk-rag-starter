-- Add 'file_id' column to 'embeddings' table if it doesn't exist
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

-- Add 'file_id' column to 'resources' table if it doesn't exist
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