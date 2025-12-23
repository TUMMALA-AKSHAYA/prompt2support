import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class VerificationAgent {
  async verify(query, answer, retrievedChunks) {
    const context = retrievedChunks.map(c => c.text).join("\n");

    const prompt = `
Verify whether the answer is strictly supported by the context.

QUESTION: ${query}
ANSWER: ${answer}
CONTEXT: ${context}

Respond ONLY in JSON:
{
  "finalVerdict": "approved | needs_revision | escalate_to_human",
  "confidence": "high | medium | low",
  "issues": []
}
`;

    const result = await model.generateContent(prompt);
    return JSON.parse(
      result.response.text().replace(/```json|```/g, "")
    );
  }
}

export default new VerificationAgent();
