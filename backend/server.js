import "dotenv/config";
import express from "express";
import cors from "cors";

import documentRoutes from "./routes/documents.js";
import queryRoutes from "./routes/queries.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/documents", documentRoutes);
app.use("/api/queries", queryRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Prompt2Support backend running on ${PORT}`);
});
