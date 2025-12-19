require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

/* =====================
   MIDDLEWARE
===================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================
   REQUIRED DIRECTORIES
===================== */
const uploadDir = path.join(__dirname, "../uploads");
const vectorDir = path.join(__dirname, "../vectors");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(vectorDir)) {
  fs.mkdirSync(vectorDir, { recursive: true });
}

/* =====================
   HEALTH CHECK
===================== */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    geminiKeyLoaded: !!process.env.GEMINI_API_KEY,
    port: process.env.PORT || 5001
  });
});

/* =====================
   ROUTES (SAFE IMPORTS)
===================== */
try {
  const documentsRoutes = require("./routes/documents");
  const queriesRoutes = require("./routes/queries");
  const analyticsRoutes = require("./routes/analytics");

  app.use("/api/documents", documentsRoutes);
  app.use("/api/queries", queriesRoutes);
  app.use("/api/analytics", analyticsRoutes);

  console.log("✅ Routes loaded successfully");
} catch (err) {
  console.error("❌ Route loading failed:", err.message);
}

/* =====================
   ERROR HANDLER
===================== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ error: err.message });
});

/* =====================
   SERVER START
===================== */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("\n🚀 PROMPT2SUPPORT BACKEND LIVE");
  console.log(`✅ Port: ${PORT}`);
  console.log(`✅ Gemini API Key: ${process.env.GEMINI_API_KEY ? "LOADED" : "MISSING"}`);
  console.log(`✅ Health: /health`);
  console.log("\n📡 API ENDPOINTS");
  console.log("POST /api/documents/upload");
  console.log("GET  /api/documents/stats");
  console.log("POST /api/queries/process");
  console.log("GET  /api/queries/history\n");
});

module.exports = app;
