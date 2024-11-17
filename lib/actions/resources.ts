"use server";

// import {
//   NewResourceParams,
//   insertResourceSchema,
//   resources,
// } from "@/lib/db/schema/resources";
import { db } from "../db";
import { generateEmbeddings } from "../ai/embedding";
import { embeddings as embeddingsTable } from "../db/schema/embeddings";
import {
  insertResourceSchema,
  NewResourceParams,
  resources,
} from "@/db/schema/resources";

export const createResource = async (input: NewResourceParams) => {
  try {
    const { fileId, content } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ fileId, content })
      .returning();

    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        fileId,
        resourceId: resource.id,
        ...embedding,
      }))
    );

    return "Resource successfully created and embedded.";
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error, please try again.";
  }
};
