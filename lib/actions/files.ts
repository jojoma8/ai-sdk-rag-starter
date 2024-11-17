import { db } from "@/db"; // Import your database connection
import { files } from "@/db/schema/files";
import { nanoid } from "@/utils";

interface CreateFileParams {
  fileTitle: string;
  sourceUrl?: string;
}

export async function createFile({
  fileTitle,
  sourceUrl,
}: CreateFileParams): Promise<string> {
  const id = nanoid();
  await db.insert(files).values({
    id,
    fileTitle,
    sourceUrl,
    uploadedAt: new Date(),
  });
  return id;
}
