import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class UnderstandingAgent {
  async analyze(query) {
    // 🔹 Fast deterministic fallback
    const q = query.toLowerCase();

    let intent = "general_inquiry";
    if (q.includes("return")) intent = "return_refund";
    else if (q.includes("track")) intent = "order_status";
    else if (q.includes("warranty")) intent = "warranty";
    else if (q.includes("emi")) intent = "billing";

    // 🔹 LLM enrichment (safe)
    try {
      const prompt = `
Extract intent & metadata from this customer query.
Respond ONLY in JSON.

Query: "${query}"

Schema:
{
  "intent": string,
  "sentiment": "positive | neutral | negative | urgent",
  "priority": "low | medium | high | critical",
  "requiresHumanEscalation": boolean
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text()
        .replace(/```json|```/g, "")
        .trim();

      const parsed = JSON.parse(text);

      return {
        intent: parsed.intent || intent,
        sentiment: parsed.sentiment || "neutral",
        priority: parsed.priority || "medium",
        requiresHumanEscalation: parsed.requiresHumanEscalation ?? false
      };

    } catch {
      // ✅ SAFE FALLBACK
      return {
        intent,
        sentiment: "neutral",
        priority: "medium",
        requiresHumanEscalation: false
      };
    }
  }
}

export default new UnderstandingAgent();
