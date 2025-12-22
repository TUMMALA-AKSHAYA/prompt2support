import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class ReasoningAgent {
  async answer(query, retrievedChunks) {
    // Build STRICT context
    const context = retrievedChunks
      .map(
        (c, i) =>
          `[Source ${i + 1}: ${c.metadata?.filename}]\n${c.text}`
      )
      .join("\n\n---\n\n");

    const prompt = `
You are a customer support AI.

RULES (VERY IMPORTANT):
- Use ONLY the information from CONTEXT
- Do NOT use outside knowledge
- If answer is NOT in context, say:
  "I do not have this information in the uploaded documents."

CONTEXT:
${context}

QUESTION:
${query}

ANSWER:
`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  }
}

export default new ReasoningAgent();
