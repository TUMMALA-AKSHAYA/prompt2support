const vectorStore = require("./vectorStore");
const verificationAgent = require("./agents/verificationAgent");
const embeddings = require("./embeddings");
const axios = require("axios");

class Orchestrator {
  async handleQuery(query) {
    // 1. Retrieve relevant document chunks
    const results = await vectorStore.search(query);

    if (!results || results.length === 0) {
      return "The uploaded documents do not contain information relevant to this question.";
    }

    // 2. Build grounded context
    const context = results
      .map(r => r.content || r.text)
      .join("\n\n");

    // 3. Ask LLM STRICTLY using document context
    const prompt = `
You are Prompt2Support, an autonomous customer support AI.

Rules:
- Use ONLY the information provided in the document context.
- If the answer is not present, say so clearly.
- Do not use external knowledge.
- Write in professional, clear paragraphs.
- No markdown, no emojis, no lists.

Document context:
${context}

Customer question:
${query}

Answer:
`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        params: { key: process.env.GEMINI_API_KEY }
      }
    );

    const rawAnswer =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No answer found in the uploaded documents.";

    // 4. Verification Agent
    const verified = await verificationAgent.verify(rawAnswer, context);

    return verified.trim();
  }
}

module.exports = new Orchestrator();
