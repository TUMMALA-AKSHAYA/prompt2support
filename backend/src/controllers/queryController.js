const axios = require("axios");
const vectorStore = require("../services/vectorStore");

class QueryController {
  async processQuery(req, res) {
    try {
      const { query } = req.body;

      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query missing" });
      }

      // ==========================
      // 🔍 MULTI-CHUNK RETRIEVAL
      // ==========================
      const retrievedChunks = vectorStore.search(query, 5);

      if (!retrievedChunks || retrievedChunks.length === 0) {
        return res.json({
          answer:
            "The requested information is not specified in the uploaded documents."
        });
      }

      // ==========================
      // 🧠 STRUCTURED CONTEXT
      // ==========================
      const context = retrievedChunks
        .map(
          (c, i) =>
            `Section ${i + 1}:\n${c.text}`
        )
        .join("\n\n");

      // ==========================
      // 🤖 STRONG AGENT PROMPT
      // ==========================
      const prompt = `
You are an enterprise-grade customer support AI.

Rules you MUST follow:
- Use ONLY the policy text below
- If a specific rule exists, it OVERRIDES any general rule
- If the information is missing, clearly say it is not specified
- Do not infer, assume, or generalize
- Do not mention documents, context, or policies in your reply
- Respond in plain professional text only

Policy text:
${context}

Customer question:
${query}
`;

      // ==========================
      // 🚀 GEMINI CALL
      // ==========================
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
          params: {
            key: process.env.GEMINI_API_KEY
          }
        }
      );

      const answer =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "The requested information is not specified in the uploaded documents.";

      res.json({ answer: answer.trim() });

    } catch (err) {
      console.error("[QueryController] error:", err.message);
      res.status(500).json({
        error: "Failed to process query"
      });
    }
  }
}

module.exports = new QueryController();
