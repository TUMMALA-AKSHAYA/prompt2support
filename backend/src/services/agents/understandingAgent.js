const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

class UnderstandingAgent {
  async analyze(query) {
    const prompt = `You are an Understanding Agent in a customer support system. Analyze this customer query and extract structured information.

Customer Query: "${query}"

Provide a JSON response with:
1. intent: The primary intent (billing, product_issue, order_status, warranty, technical_support, return_refund, general_inquiry)
2. entities: Key entities mentioned (product names, order IDs, dates, amounts, etc.)
3. sentiment: Customer sentiment (positive, neutral, negative, urgent)
4. priority: Priority level (low, medium, high, critical)
5. category: Main category of the issue
6. requiresHumanEscalation: Boolean if this needs human intervention

Respond ONLY with valid JSON, no other text.`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const responseText = message.content[0].text;
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      return {
        agent: 'Understanding',
        status: 'completed',
        result: JSON.parse(cleanedResponse),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Understanding Agent error:', error);
      
      // Fallback analysis
      return {
        agent: 'Understanding',
        status: 'completed',
        result: {
          intent: 'general_inquiry',
          entities: {},
          sentiment: 'neutral',
          priority: 'medium',
          category: 'general',
          requiresHumanEscalation: false
        },
        timestamp: new Date(),
        error: error.message
      };
    }
  }
}

module.exports = new UnderstandingAgent();