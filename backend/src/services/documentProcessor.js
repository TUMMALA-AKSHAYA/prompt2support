const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');

class DocumentProcessor {
  constructor() {
    this.chunkSize = 500;
    this.chunkOverlap = 50;
  }

  async processDocument(filePath, metadata = {}) {
    const extension = path.extname(filePath).toLowerCase();
    let text = '';

    try {
      console.log('[DocumentProcessor] Processing:', filePath);
      
      switch (extension) {
        case '.pdf':
          throw new Error('PDF support temporarily disabled. Please use TXT or DOCX files.');
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

      console.log('[DocumentProcessor] Text extracted, length:', text.length);

      if (!text || text.trim().length === 0) {
        throw new Error('No text could be extracted from the document');
      }

      const chunks = this.chunkText(text);
      
      console.log('[DocumentProcessor] Created', chunks.length, 'chunks');

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
      console.error('[DocumentProcessor] Error:', error.message);
      throw error;
    }
  }

  async processDOCX(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      console.error('[DocumentProcessor] DOCX parse error:', error);
      throw new Error(`Failed to parse DOCX: ${error.message}`);
    }
  }

  async processTXT(filePath) {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.error('[DocumentProcessor] TXT read error:', error);
      throw new Error(`Failed to read TXT: ${error.message}`);
    }
  }

  chunkText(text) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
      let end = start + this.chunkSize;
      
      if (end < text.length) {
        const sentenceEnd = text.lastIndexOf('.', end);
        if (sentenceEnd > start) {
          end = sentenceEnd + 1;
        }
      }

      const chunkText = text.slice(start, end).trim();
      
      if (chunkText.length > 0) {
        chunks.push({
          text: chunkText,
          startChar: start,
          endChar: end
        });
      }

      start = end - this.chunkOverlap;
    }

    return chunks;
  }
}

module.exports = new DocumentProcessor();