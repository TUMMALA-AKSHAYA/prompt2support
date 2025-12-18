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

      console.log('[DocumentController] Processing file:', req.file.originalname);

      const filePath = req.file.path;
      const category = req.body.category || 'general';

      // Process the document
      const processed = await documentProcessor.processDocument(filePath, {
        category,
        uploadedAt: new Date(),
        originalName: req.file.originalname
      });

      console.log('[DocumentController] Document processed:', {
        chunks: processed.chunks.length,
        type: processed.type
      });

      // Store vectors for each chunk
      const vectorIds = [];
      for (let i = 0; i < processed.chunks.length; i++) {
        const chunk = processed.chunks[i];
        const vectorId = await vectorStore.addDocument({
          text: chunk.text,
          metadata: {
            filename: processed.filename,
            chunkIndex: i,
            category: category,
            ...processed.metadata
          }
        });
        vectorIds.push(vectorId);
      }

      console.log('[DocumentController] Stored vectors:', vectorIds.length);

      res.json({
        success: true,
        message: 'Document uploaded and processed successfully',
        data: {
          filename: processed.filename,
          type: processed.type,
          chunks: processed.chunks.length,
          vectorIds: vectorIds.length,
          category
        }
      });

    } catch (error) {
      console.error('[DocumentController] Upload error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to process document'
      });
    }
  }

  async listDocuments(req, res) {
    try {
      const uploadsDir = path.join(__dirname, '../../uploads');
      
      let files = [];
      try {
        const fileNames = await fs.readdir(uploadsDir);
        files = await Promise.all(
          fileNames.map(async (filename) => {
            const filePath = path.join(uploadsDir, filename);
            const stats = await fs.stat(filePath);
            return {
              filename,
              uploadedAt: stats.mtime,
              size: stats.size
            };
          })
        );
      } catch (error) {
        console.log('[DocumentController] No uploads directory or empty');
      }

      res.json({
        success: true,
        data: files
      });

    } catch (error) {
      console.error('[DocumentController] List error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list documents'
      });
    }
  }

  async deleteDocument(req, res) {
    try {
      const { filename } = req.params;
      const filePath = path.join(__dirname, '../../uploads', filename);

      await fs.unlink(filePath);

      res.json({
        success: true,
        message: 'Document deleted successfully'
      });

    } catch (error) {
      console.error('[DocumentController] Delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete document'
      });
    }
  }

  async getStats(req, res) {
    try {
      const stats = await vectorStore.getStats();
      
      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('[DocumentController] Stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get stats',
        data: { totalVectors: 0, documents: 0 }
      });
    }
  }
}

module.exports = new DocumentController();