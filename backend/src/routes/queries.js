import express from "express";
import orchestrator from "../services/orchestrator.js";

const router = express.Router();

// --------------------
// Handle user queries
// --------------------
router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    console.log("❓ User query:", query);

    // Use orchestrator to handle the query with AI and vector search
    const answer = await orchestrator.handleQuery(query);

    res.json({
      success: true,
      answer: answer,
      source: "ai_generated"
    });
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({
      success: false,
      error: "There was an issue processing your request. Please try again."
    });
  }
});

// ✅ DEFAULT EXPORT
export default router;