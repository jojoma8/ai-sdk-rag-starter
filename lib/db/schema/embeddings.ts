import { generateId } from "ai";
import { index, pgTable, text, varchar, vector } from "drizzle-orm/pg-core";
// import { resources } from "./resources";
import { files } from "./files";

export const embeddings = pgTable(
  "embeddings",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => generateId()),
    // resourceId: varchar("resource_id", { length: 191 }).references(
    //   () => resources.id,
    //   { onDelete: "cascade" }
    // ),
    fileId: varchar("file_id", { length: 191 })
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),

    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);
