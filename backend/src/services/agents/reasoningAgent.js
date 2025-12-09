const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

class ReasoningAgent {
  async reason(query, understanding, retrievedData) {
    const { retrievedChunks, sources } = retrievedData;
    
    // Build context from retrieved chunks
    const context = retrievedChunks
      .map((chunk, idx) => `[Source ${idx + 1}: ${chunk.metadata.filename}]\n${chunk.text}`)
      .join('\n\n---\n\n');

    const prompt = `You are a Reasoning Agent in a customer support system. Use the retrieved information to answer the customer's query accurately.

Customer Query: "${query}"

Intent: ${understanding.intent}
Priority: ${understanding.priority}

Retrieved Information:
${context}

Instructions:
1. Answer the customer's question directly and clearly
2. Use ONLY information from the retrieved sources
3. Cite which source you're using (e.g., "According to [Source 1]...")
4. If information is insufficient, say so clearly
5. Be helpful, professional, and concise
6. Format your response in a customer-friendly way

Provide your response:`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const response = message.content[0].text;

      return {
        agent: 'Reasoning',
        status: 'completed',
        result: {
          answer: response,
          sourcesUsed: sources,
          confidence: this.calculateConfidence(retrievedChunks)
        },
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Reasoning Agent error:', error);
      throw error;
    }
  }

  calculateConfidence(chunks) {
    if (chunks.length === 0) return 'low';
    
    const avgRelevance = chunks.reduce((sum, chunk) => sum + chunk.relevance, 0) / chunks.length;
    
    if (avgRelevance > 0.7) return 'high';
    if (avgRelevance > 0.4) return 'medium';
    return 'low';
  }
}

module.exports = new ReasoningAgent();