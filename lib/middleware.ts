// lib/middleware.ts
import { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable";
import { IncomingMessage } from "http";

export const config = {
  api: {
    bodyParser: false, // Disables Next.js's default body parsing
  },
};

// Extend NextApiRequest to include files property
export interface NextApiRequestWithFiles extends NextApiRequest {
  files?: Files;
}

const parseForm = (
  req: IncomingMessage
): Promise<{ fields: Fields; files: Files }> => {
  const form = formidable({
    uploadDir: "/tmp", // Directory where files will be uploaded
    keepExtensions: true, // Keep file extensions
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequestWithFiles,
  res: NextApiResponse,
  next: (err?: any) => void
) {
  try {
    const { fields, files } = await parseForm(req);
    req.body = fields;
    req.files = files;
    next();
  } catch (err) {
    res.status(500).json({ error: "Error parsing form data" });
  }
}
