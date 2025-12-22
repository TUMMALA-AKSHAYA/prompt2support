import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import mammoth from "mammoth";

export async function extractText(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase();

  try {
    // TXT
    if (ext === ".txt") {
      return fs.readFileSync(filePath, "utf8");
    }

    // PDF
    if (ext === ".pdf") {
      const buffer = fs.readFileSync(filePath);
      const data = await pdf(buffer);
      return data.text;
    }

    // DOCX
    if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }

    return "";
  } catch (err) {
    console.error("Text extraction failed:", err);
    return "";
  }
}
