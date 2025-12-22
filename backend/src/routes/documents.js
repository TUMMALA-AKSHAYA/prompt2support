import express from "express";
import vectorStore from "../services/vectorStore.js";

const router = express.Router();

/**
 * POST /api/queries
 * Body: { query: string }
 */
router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Query is required",
      });
    }

    console.log("🔍 Incoming query:", query);

    // ----------------------------
    // 🔎 REAL RETRIEVAL STEP
    // ----------------------------
    
    const retrievedChunks = await vectorStore.search(query, 4);


    console.log(
      "📦 Retrieved chunks:",
      retrievedChunks.length
    );

    if (!retrievedChunks || retrievedChunks.length === 0) {
      return res.json({
        success: false,
        answer:
          "I could not find relevant information in the uploaded documents.",
        source: "no_match",
      });
    }

    // ----------------------------
    // 🧠 BUILD CONTEXT
    // ----------------------------
    const context = retrievedChunks
      .map((c, i) => `(${i + 1}) ${c.text}`)
      .join("\n\n");

    console.log("🧠 Context built:\n", context.substring(0, 300), "...");

    // ----------------------------
    // 🧾 FINAL ANSWER (NO LLM YET)
    // ----------------------------
    const answer = `
Based on your uploaded documents, here is the most relevant information:

${context}
`;

    return res.json({
      success: true,
      answer,
      source: "document_retrieval",
      matches: retrievedChunks.map((c) => ({
        filename: c.metadata?.filename,
        score: c.score,
      })),
    });
  } catch (error) {
    console.error("❌ Query error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process query",
    });
  }
});

export default router;
