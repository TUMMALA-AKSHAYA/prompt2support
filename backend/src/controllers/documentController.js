const documentProcessor = require('../services/documentProcessor');
const vectorStore = require('../services/vectorStore');
const path = require('path');
const fs = require('fs').promises;

class DocumentController {
  async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      const filePath = req.file.path;

      const processed = await documentProcessor.processDocument(filePath, {
        originalName: req.file.originalname,
        uploadedAt: new Date()
      });

      // ================================
      // STEP 3 — VERIFY CHUNKS (CRITICAL)
      // ================================
      console.log(
        processed.chunks.map((c, i) => ({
          i,
          preview: c.text.slice(0, 80)
        }))
      );
      // ================================

      for (let i = 0; i < processed.chunks.length; i++) {
        await vectorStore.addDocument({
          text: processed.chunks[i].text,
          metadata: {
            filename: processed.filename,
            chunkIndex: i
          }
        });
      }

      res.json({
        success: true,
        message: 'Document uploaded and indexed successfully',
        chunks: processed.chunks.length
      });

    } catch (error) {
      console.error('[DocumentController] upload error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getStats(req, res) {
    try {
      const stats = vectorStore.getStats();

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('[DocumentController] stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get document stats'
      });
    }
  }

  async listDocuments(req, res) {
    try {
      const uploadsDir = path.join(__dirname, '../../uploads');
      const files = await fs.readdir(uploadsDir);

      res.json({
        success: true,
        data: files
      });

    } catch {
      res.json({ success: true, data: [] });
    }
  }
}

module.exports = new DocumentController();
