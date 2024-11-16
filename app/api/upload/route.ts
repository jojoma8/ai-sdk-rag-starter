import { createResource } from "@/actions/resources";
import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const { chunks }: { chunks: string[] } = await req.json();

    if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
      return NextResponse.json(
        { error: "No text chunks provided." },
        { status: 400 }
      );
    }

    console.log("Received text chunks:", chunks);

    for (const chunk of chunks) {
      await createResource({ content: chunk });
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
