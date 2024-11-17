import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql"; // Import sql from the correct package
import { nanoid } from "@/utils";

export const files = pgTable("files", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),

  fileTitle: text("file_title").notNull(), // File name
  sourceUrl: text("source_url"), // Optional: Original source URL if provided
  uploadedAt: timestamp("uploaded_at")
    .notNull()
    .default(sql`now()`), // When the file was uploaded
});
