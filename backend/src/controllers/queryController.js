const axios = require("axios");
const vectorStore = require("../services/vectorStore");

class QueryController {
  async processQuery(req, res) {
    try {
      const { query } = req.body;

      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query missing" });
      }

      // 🔍 RETRIEVAL AGENT
      const relevantChunks = await vectorStore.search(query, 4);

      if (!relevantChunks || relevantChunks.length === 0) {
        return res.json({
          answer:
            "I could not find relevant information in the uploaded documents. Please upload the correct files or rephrase your question."
        });
      }

      const contextText = relevantChunks
        .map((c, i) => `Context ${i + 1}: ${c.text}`)
        .join("\n\n");

      // 🧠 REASONING AGENT (Gemini)
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
You are a professional customer support AI assistant.

Answer ONLY using the information below.
Do not use markdown symbols.
Do not use emojis.
Write clear professional paragraphs.

DOCUMENT CONTEXT:
${contextText}

USER QUESTION:
${query}
`
                }
              ]
            }
          ]
        },
        {
          params: { key: process.env.GEMINI_API_KEY }
        }
      );

      const answer =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Unable to generate answer.";

      res.json({ answer: answer.trim() });
    } catch (err) {
      console.error("Query error:", err.message);
      res.status(500).json({
        error: "Failed to process query"
      });
    }
  }
}

module.exports = new QueryController();
