const documentProcessor = require('../services/documentProcessor');
const vectorStore = require('../services/vectorStore');
const fs = require('fs').promises;

class DocumentController {
  async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const metadata = {
        uploadedBy: req.body.uploadedBy || 'system',
        category: req.body.category || 'general',
        tags: req.body.tags ? JSON.parse(req.body.tags) : []
      };

      // Process document
      const processedDoc = await documentProcessor.processDocument(req.file.path, metadata);

      // Add to vector store
      await vectorStore.addDocument(processedDoc);

      res.json({
        success: true,
        message: 'Document processed successfully',
        data: {
          filename: processedDoc.filename,
          chunks: processedDoc.chunks.length,
          metadata: processedDoc.metadata
        }
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async listDocuments(req, res) {
    try {
      const stats = vectorStore.getStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteDocument(req, res) {
    try {
      // Implementation for deleting specific document
      res.json({ success: true, message: 'Delete functionality to be implemented' });
    } catch (error) {
      res.status(500).json({ error: error.message });
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
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DocumentController();