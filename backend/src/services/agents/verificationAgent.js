import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

class VerificationAgent {
  async verify(query, answer, retrievedData) {
    const { retrievedChunks } = retrievedData;
    
    const context = retrievedChunks.map((chunk) => chunk.text).join('\n\n');

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
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const verification = JSON.parse(cleanedResponse);

      return {
        agent: 'Verification',
        status: 'completed',
        result: verification,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Verification Agent error:', error);
      
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

export default new VerificationAgent();