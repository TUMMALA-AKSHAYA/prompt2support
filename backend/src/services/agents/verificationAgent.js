import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class VerificationAgent {
  async verify(query, answer, retrievedChunks) {
    const context = retrievedChunks
      .map((c) => c.text)
      .join("\n\n");

    const prompt = `
You are a verification agent.

TASK:
Check whether the ANSWER is fully supported by the CONTEXT.

RULES:
- If answer is fully supported → approve
- If partially supported → needs_revision
- If not supported → escalate_to_human
- No hallucinations allowed

QUESTION:
${query}

ANSWER:
${answer}

CONTEXT:
${context}

Respond ONLY in JSON:

{
  "finalVerdict": "approved | needs_revision | escalate_to_human",
  "confidence": "high | medium | low",
  "issues": [],
  "notes": ""
}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return JSON.parse(
      response.replace(/```json|```/g, "").trim()
    );
  }
}

export default new VerificationAgent();
