import 'dotenv/config';
import express from "express";
import cors from "cors";
import documentRoutes from "./routes/documents.js";
import queryRoutes from "./routes/queries.js";

const app = express();
const PORT = 5003; // Use a different port

console.log("✅ Using in-memory storage for demo");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/documents", documentRoutes);
app.use("/api/queries", queryRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("🚀 Prompt2Support backend is running");
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});