const orchestrator = require('../services/orchestrator');

class QueryController {
  constructor() {
    this.queryHistory = [];
  }

  async processQuery(req, res) {
    try {
      const { query, generateActions = false } = req.body;

      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const result = await orchestrator.processQuery(query, { generateActions });

      // Store in history
      this.queryHistory.unshift({
        id: Date.now().toString(),
        query: query,
        result: result,
        timestamp: new Date()
      });

      // Keep only last 50 queries
      if (this.queryHistory.length > 50) {
        this.queryHistory = this.queryHistory.slice(0, 50);
      }

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Query processing error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getHistory(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      res.json({
        success: true,
        data: this.queryHistory.slice(0, limit)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new QueryController();