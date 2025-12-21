
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

class UnderstandingAgent {
  async analyze(query) {
    const prompt = `You are an Understanding Agent in a customer support system.
Analyze the customer query and extract structured information.

Customer Query: "${query}"

Respond ONLY with valid JSON.

JSON schema:
{
  "intent": "billing | product_issue | order_status | warranty | technical_support | return_refund | general_inquiry | send_email | check_email | summarize_email | schedule_meeting | check_calendar | reschedule_meeting",
  "entities": {
    "orderId": "",
    "product": "",
    "amount": "",
    "date": "",
    "time": "",
    "email": "",
    "subject": "",
    "body": "",
    "participants": []
  },
  "sentiment": "positive | neutral | negative | urgent",
  "priority": "low | medium | high | critical",
  "category": "billing | product | order | support | email | calendar | general",
  "requiresHumanEscalation": true | false
}`;

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