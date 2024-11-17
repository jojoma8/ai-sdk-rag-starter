import { createFile } from "@/actions/files";
import { createResource } from "@/actions/resources";
import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const {
      chunks,
      fileTitle,
      sourceUrl,
    }: { chunks: string[]; fileTitle: string; sourceUrl: string } =
      await req.json();

    if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
      return NextResponse.json(
        { error: "No text chunks provided." },
        { status: 400 }
      );
    }

    console.log("Received text chunks: ", chunks);
    console.log("Received file name:", fileTitle);

    const fileId = await createFile({ fileTitle, sourceUrl });

    for (const chunk of chunks) {
      await createResource({ fileId, content: chunk });
    }

    return NextResponse.json({
      message: "Resources successfully created and embedded.",
    });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF.", details: (error as Error).message },
      { status: 500 }
    );
  }
}
