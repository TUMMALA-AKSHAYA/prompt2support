import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class ReasoningAgent {
  async answer(query, retrievedChunks) {
    const context = retrievedChunks
      .map(
        (c, i) =>
          `[Source ${i + 1}: ${c.metadata?.filename}]\n${c.text}`
      )
      .join("\n\n");

    const prompt = `
Answer the question using ONLY the information below.
If the answer is not present, say:
"I could not find this information in the uploaded documents."

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
