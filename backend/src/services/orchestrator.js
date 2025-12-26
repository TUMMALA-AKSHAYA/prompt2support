import fs from "fs";
import path from "path";
import axios from "axios";

class Orchestrator {
  async handleQuery(query) {
    const filePath = path.join(process.cwd(), "uploads", "knowledge.txt");

    // 1️⃣ No document uploaded
    if (!fs.existsSync(filePath)) {
      return { answer: "No document uploaded yet." };
    }

    const documentText = fs.readFileSync(filePath, "utf-8").trim();

    // 2️⃣ Empty document
    if (!documentText) {
      return { answer: "No document content available." };
    }

    // 3️⃣ Gemini-powered grounded answer
    if (process.env.GEMINI_API_KEY) {
      const prompt = `
You are a customer support AI.

Rules:
- Use ONLY the document content below
- Answer in ONE clear sentence
- Be precise and factual
- If the answer is not present, say:
  "The document does not contain this information."

Document:
${documentText}

Question:
${query}

Answer:
`;

      try {
        const response = await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
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

        const raw =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        return {
          answer: raw
            ? raw.replace(/\n+/g, " ").trim()
            : "The document does not contain this information."
        };
      } catch (err) {
        console.error("❌ Gemini error:", err.message);
        return {
          answer: "The document does not contain this information."
        };
      }
    }

    // 4️⃣ No API key fallback
    return {
      answer: "AI service is not configured."
    };
  }
}

export default new Orchestrator();
