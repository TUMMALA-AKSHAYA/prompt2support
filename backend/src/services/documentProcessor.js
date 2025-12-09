const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');

class DocumentProcessor {
  constructor() {
    this.chunkSize = 500; // characters per chunk
    this.chunkOverlap = 50;
  }

  async processDocument(filePath, metadata = {}) {
    const extension = path.extname(filePath).toLowerCase();
    let text = '';

    try {
      switch (extension) {
        case '.pdf':
          text = await this.processPDF(filePath);
          break;
        case '.docx':
        case '.doc':
          text = await this.processDOCX(filePath);
          break;
        case '.txt':
          text = await this.processTXT(filePath);
          break;
        default:
          throw new Error(`Unsupported file type: ${extension}`);
      }

      const chunks = this.chunkText(text);
      return {
        filename: path.basename(filePath),
        type: extension,
        fullText: text,
        chunks: chunks,
        metadata: {
          ...metadata,
          processedAt: new Date(),
          chunkCount: chunks.length,
          characterCount: text.length
        }
      };
    } catch (error) {
      console.error(`Error processing document: ${error.message}`);
      throw error;
    }
  }

  async processPDF(filePath) {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  async processDOCX(filePath) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  async processTXT(filePath) {
    return await fs.readFile(filePath, 'utf-8');
  }

  chunkText(text) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
      let end = start + this.chunkSize;
      
      // Try to break at sentence boundaries
      if (end < text.length) {
        const sentenceEnd = text.lastIndexOf('.', end);
        if (sentenceEnd > start) {
          end = sentenceEnd + 1;
        }
      }

      chunks.push({
        text: text.slice(start, end).trim(),
        startChar: start,
        endChar: end
      });

      start = end - this.chunkOverlap;
    }

    return chunks;
  }
}

module.exports = new DocumentProcessor();