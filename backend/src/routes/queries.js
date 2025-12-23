import express from "express";
import orchestrator from "../controllers/orchestrator.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: "Query is required"
      });
    }

    const result = await orchestrator.handleQuery(query);
    return res.json(result);

  } catch (err) {
    console.error("❌ Query failed:", err);
    res.status(500).json({
      success: false,
      error: "Internal error processing query"
    });
  }
});

export default router;
