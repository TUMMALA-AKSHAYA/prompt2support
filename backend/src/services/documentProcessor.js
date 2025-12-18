const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');

// For PDF parsing - using pdf-parse with proper configuration
let pdfParse;
try {
  pdfParse = require('pdf-parse');
} catch (error) {
  console.warn('[DocumentProcessor] pdf-parse not available, PDF support disabled');
}

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
          throw new Error(`Unsupported file type: ${extension}. Please upload PDF, DOCX, or TXT files.`);
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

  async processPDF(filePath) {
    if (!pdfParse) {
      throw new Error('PDF support not available. Please install pdf-parse: npm install pdf-parse canvas');
    }

    try {
      console.log('[DocumentProcessor] Reading PDF file...');
      const dataBuffer = await fs.readFile(filePath);
      
      console.log('[DocumentProcessor] Parsing PDF, size:', dataBuffer.length, 'bytes');
      
      // Parse PDF with pdf-parse
      const data = await pdfParse(dataBuffer, {
        // Options to improve text extraction
        max: 0, // Parse all pages
      });
      
      console.log('[DocumentProcessor] PDF parsed successfully');
      console.log('[DocumentProcessor] Pages:', data.numpages);
      console.log('[DocumentProcessor] Text length:', data.text.length);
      
      if (!data.text || data.text.trim().length === 0) {
        throw new Error('PDF appears to be empty or contains only images');
      }
      
      return data.text.trim();
    } catch (error) {
      console.error('[DocumentProcessor] PDF parse error:', error);
      
      // More helpful error messages
      if (error.message.includes('pdf-parse')) {
        throw new Error('PDF parsing library not properly installed. Please run: npm install pdf-parse canvas');
      }
      
      throw new Error(`Failed to parse PDF: ${error.message}. Make sure the PDF contains readable text, not just images.`);
    }
  }

  async processDOCX(filePath) {
    try {
      console.log('[DocumentProcessor] Reading DOCX file...');
      const result = await mammoth.extractRawText({ path: filePath });
      
      if (!result.value || result.value.trim().length === 0) {
        throw new Error('DOCX appears to be empty');
      }
      
      console.log('[DocumentProcessor] DOCX parsed successfully, text length:', result.value.length);
      return result.value;
    } catch (error) {
      console.error('[DocumentProcessor] DOCX parse error:', error);
      throw new Error(`Failed to parse DOCX: ${error.message}`);
    }
  }

  async processTXT(filePath) {
    try {
      console.log('[DocumentProcessor] Reading TXT file...');
      const text = await fs.readFile(filePath, 'utf-8');
      
      if (!text || text.trim().length === 0) {
        throw new Error('TXT file is empty');
      }
      
      console.log('[DocumentProcessor] TXT read successfully, text length:', text.length);
      return text;
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
      
      // Try to break at sentence boundaries
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