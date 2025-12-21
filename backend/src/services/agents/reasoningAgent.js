const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

class ReasoningAgent {
  async generateAnswer(query, understanding, retrievedContext) {
    try {
      console.log('[ReasoningAgent] Generating answer from', retrievedContext.length, 'documents');

      // Build context from retrieved documents
      const contextText = retrievedContext
        .map((doc, idx) => {
          const source = doc.metadata?.filename || 'document';
          return `[Source ${idx + 1}: ${source}]\n${doc.text}`;
        })
        .join('\n\n---\n\n');

      // Create prompt that STRICTLY uses only the provided context
      const prompt = `You are a customer support assistant. Answer the question using ONLY the information provided in the context below. Do not use any external knowledge.

CONTEXT FROM UPLOADED DOCUMENTS:
${contextText}

CUSTOMER QUESTION: ${query}

INSTRUCTIONS:
1. Answer ONLY based on the context above
2. If the answer is in the context, provide a clear, helpful response
3. If the answer is NOT in the context, say: "I don't have that information in the uploaded documents. Please upload relevant documents or contact support."
4. Quote relevant parts from the context to support your answer
5. Be specific and cite which document the information came from
6. Keep the answer concise and customer-friendly

ANSWER:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let answer = response.text();

      // Clean up the response
      answer = answer.trim();

      console.log('[ReasoningAgent] Answer generated, length:', answer.length);

      return answer;

    } catch (error) {
      console.error('[ReasoningAgent] Error:', error);
      throw new Error(`Failed to generate answer: ${error.message}`);
    }
  }
}

module.exports = new ReasoningAgent();