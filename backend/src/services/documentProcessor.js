import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import mammoth from "mammoth";

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 100;

class DocumentProcessor {
  async processDocument(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    let fullText = "";

    if (ext === ".txt") {
      fullText = fs.readFileSync(filePath, "utf8");
    }

    if (ext === ".pdf") {
      const buffer = fs.readFileSync(filePath);
      const data = await pdf(buffer);
      fullText = data.text;
    }

    if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      fullText = result.value;
    }

    fullText = this.cleanText(fullText);
    const chunks = this.chunkText(fullText);

    return {
      fullText,
      chunks
    };
  }

  cleanText(text) {
    return text
      .replace(/\s+/g, " ")
      .replace(/\n+/g, "\n")
      .trim();
  }

  chunkText(text) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
      const end = start + CHUNK_SIZE;
      chunks.push({
        text: text.slice(start, end),
        startChar: start
      });
      start += CHUNK_SIZE - CHUNK_OVERLAP;
    }

    return chunks;
  }
}

export default new DocumentProcessor();
