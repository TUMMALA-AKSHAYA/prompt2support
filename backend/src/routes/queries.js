import express from "express";
import { handleQuery } from "../controllers/queryController.js";

const router = express.Router();

// POST /api/queries
router.post("/", handleQuery);

export default router;
