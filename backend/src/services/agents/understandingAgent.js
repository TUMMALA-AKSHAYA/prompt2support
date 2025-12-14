const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      return {
        agent: 'Understanding',
        status: 'completed',
        result: JSON.parse(cleanedResponse),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Understanding Agent error:', error);
      
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