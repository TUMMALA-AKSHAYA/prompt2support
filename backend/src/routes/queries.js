import express from "express";
import { runOrchestrator } from "../controllers/orchestrator.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ success: false, error: "Query required" });
  }

  try {
    const result = await runOrchestrator(query);
    res.json(result);
  } catch (err) {
    console.error("❌ Orchestration error:", err);
    res.status(500).json({ success: false, error: "Query failed" });
  }
});

export default router;
