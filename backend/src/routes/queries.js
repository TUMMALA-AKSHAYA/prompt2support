import express from "express";
import orchestrator from "../services/orchestrator.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.json({
      success: false,
      answer: "Query is required"
    });
  }

  const result = await orchestrator.handleQuery(query);

  res.json({
    success: true,
    answer: result.answer, // ALWAYS STRING
    sources: result.sources || []
  });
});

export default router;
