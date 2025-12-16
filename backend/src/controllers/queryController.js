const orchestrator = require('../services/orchestrator');

class QueryController {
  constructor() {
    this.queryHistory = [];
    console.log('[QueryController] Initialized');
  }

  async processQuery(req, res) {
    try {
      const { query, generateActions = false } = req.body;

      if (!query) {
        return res.status(400).json({ 
          success: false,
          error: 'Query is required' 
        });
      }

      console.log('[QueryController] Processing query:', query);

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

      console.log('[QueryController] Query processed successfully');

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('[QueryController] Error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async getHistory(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      console.log('[QueryController] Returning history, count:', this.queryHistory.length);
      
      res.json({
        success: true,
        data: this.queryHistory.slice(0, limit)
      });
    } catch (error) {
      console.error('[QueryController] History error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
}

// Export a singleton instance
module.exports = new QueryController();
