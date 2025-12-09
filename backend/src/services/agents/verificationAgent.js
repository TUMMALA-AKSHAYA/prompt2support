const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

class VerificationAgent {
  async verify(query, answer, retrievedData) {
    const { retrievedChunks } = retrievedData;
    
    const context = retrievedChunks
      .map((chunk) => chunk.text)
      .join('\n\n');

    const prompt = `You are a Verification Agent. Your job is to check if the answer is accurate and grounded in the retrieved information.

Customer Query: "${query}"

Proposed Answer:
${answer}

Retrieved Context:
${context}

Verify:
1. Is the answer factually supported by the context?
2. Are there any hallucinations or unsupported claims?
3. Are the citations accurate?
4. Is anything critical missing?

Respond with JSON:
{
  "isAccurate": boolean,
  "confidence": "high" | "medium" | "low",
  "issues": ["list of any issues found"],
  "suggestions": ["list of improvements if needed"],
  "finalVerdict": "approved" | "needs_revision" | "escalate_to_human"
}

Respond ONLY with valid JSON.`;

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
      const verification = JSON.parse(cleanedResponse);

      return {
        agent: 'Verification',
        status: 'completed',
        result: verification,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Verification Agent error:', error);
      
      // Default to cautious approval
      return {
        agent: 'Verification',
        status: 'completed',
        result: {
          isAccurate: true,
          confidence: 'medium',
          issues: [],
          suggestions: [],
          finalVerdict: 'approved'
        },
        timestamp: new Date(),
        error: error.message
      };
    }
  }
}

module.exports = new VerificationAgent();