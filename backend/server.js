import "dotenv/config";
import express from "express";
import cors from "cors";

import documentRoutes from "./src/routes/documents.js";
import queryRoutes from "./src/routes/queries.js";

console.log("🔑 GEMINI KEY LOADED:", !!process.env.GEMINI_API_KEY);

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/api/documents", documentRoutes);
app.use("/api/queries", queryRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
