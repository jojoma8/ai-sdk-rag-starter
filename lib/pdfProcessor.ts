import pdf from "pdf-parse";

export const extractTextFromPDF = async (
  fileBuffer: Buffer
): Promise<string> => {
  const data = await pdf(fileBuffer);
  return data.text;
};
