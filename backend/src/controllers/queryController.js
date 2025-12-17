const axios = require("axios");

class QueryController {
  async processQuery(req, res) {
    try {
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({ error: "Query missing" });
      }

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
        {
          contents: [
            {
              role: "user",
              parts: [{ text: query }]
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
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No AI response";

      res.json({ answer });

    } catch (err) {
      console.error("🔥 GEMINI ERROR:", err.response?.data || err.message);
      res.status(500).json({
        error: err.response?.data || err.message
      });
    }
  }
}

module.exports = new QueryController();
