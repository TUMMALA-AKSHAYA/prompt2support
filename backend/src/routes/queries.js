import express from "express";
import vectorStore from "../services/vectorStore.js";
import reasoningAgent from "../services/agents/reasoningAgent.js";
import verificationAgent from "../services/agents/verificationAgent.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, error: "Query required" });
    }

    // 🔎 Retrieval
    const retrievedChunks = await vectorStore.search(query, 4);

    if (retrievedChunks.length === 0) {
      return res.json({
        success: false,
        answer: "No relevant information found in uploaded documents.",
      });
    }

    // 🧠 Reasoning
    const answer = await reasoningAgent.answer(query, retrievedChunks);

    // 🛡️ Verification
    const verification = await verificationAgent.verify(
      query,
      answer,
      retrievedChunks
    );

    // 🚨 Escalation logic
    if (verification.finalVerdict === "escalate_to_human") {
      return res.json({
        success: false,
        answer:
          "This query requires human assistance. Please contact support.",
        verification,
      });
    }

    return res.json({
      success: true,
      answer,
      verification,
      sources: retrievedChunks.map((c) => c.metadata?.filename),
    });

  } catch (err) {
    console.error("❌ Query error:", err);
    res.status(500).json({ success: false, error: "Query failed" });
  }
});

export default router;
