import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const UploadForm: React.FC = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  if (typeof window !== "undefined" && "Worker" in window) {
    GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
  }

  // Function to chunk text into meaningful segments
  const chunkText = (text: string, chunkSize: number = 200): string[] => {
    const words = text.split(" ");
    const chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(" "));
    }
    return chunks;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      setFileUrl(null);
    } else if (selectedFile) {
      setError(null);
      const url = URL.createObjectURL(selectedFile);
      setFileUrl(url);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const pdf = await getDocument({ data: uint8Array }).promise;
        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          text += strings.join(" ") + " ";
        }

        const textChunks = chunkText(text);
        setExtractedText(text);

        // Send the text chunks to the server
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chunks: textChunks }),
        });

        console.log("Extracted text chunks:", textChunks);
      } catch (err) {
        console.error("Error extracting text:", err);
        setError("An error occurred while extracting text from the PDF.");
      }
    }
  };
  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {error && <p className="text-red-500">{error}</p>}
      {fileUrl && (
        <div className="mt-4">
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`}
          >
            <Viewer fileUrl={fileUrl} />
          </Worker>
        </div>
      )}
      {extractedText && (
        <div className="mt-4">
          <h3>Extracted Text:</h3>
          <p>{extractedText}</p>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
