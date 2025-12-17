const axios = require("axios");

class QueryController {
  async processQuery(req, res) {
    try {
      const { query } = req.body;

      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query missing" });
      }

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

STRICT RESPONSE RULES:
- Do NOT use markdown symbols (no *, **, #, ##, ---, tables, bullets).
- Do NOT use emojis.
- Do NOT use headings.
- Do NOT use numbered or bulleted lists.
- Write in clear, simple paragraphs.
- Keep answers concise, professional, and human-like.
- Respond exactly like ChatGPT in plain text.
- If you lack user-specific data, explain politely and briefly.
- Do not hallucinate personal details.

User question:
${query}
`
                }
              ]
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
        "I am unable to provide an answer at the moment.";

      res.json({ answer: answer.trim() });

    } catch (err) {
      console.error("Gemini error:", err.response?.data || err.message);
      res.status(500).json({
        error: "AI backend error. Please check API configuration."
      });
    }
  }
}

module.exports = new QueryController();
