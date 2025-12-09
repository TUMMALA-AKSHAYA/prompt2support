const vectorStore = require('../vectorStore');

class RetrievalAgent {
  async retrieve(query, understanding) {
    const { intent, entities, category } = understanding;
    
    // Enhance query with intent and entities
    const enhancedQuery = this.buildEnhancedQuery(query, intent, entities, category);
    
    // Search vector store
    const results = await vectorStore.search(enhancedQuery, 5);
    
    return {
      agent: 'Retrieval',
      status: 'completed',
      result: {
        retrievedChunks: results,
        totalFound: results.length,
        relevanceScores: results.map(r => r.relevance),
        sources: [...new Set(results.map(r => r.metadata.filename))]
      },
      timestamp: new Date()
    };
  }

  buildEnhancedQuery(originalQuery, intent, entities, category) {
    let enhanced = originalQuery;
    
    // Add intent keywords
    if (intent) {
      enhanced += ` ${intent.replace('_', ' ')}`;
    }
    
    // Add entity values
    Object.values(entities).forEach(value => {
      if (typeof value === 'string') {
        enhanced += ` ${value}`;
      }
    });
    
    return enhanced;
  }
}

module.exports = new RetrievalAgent();