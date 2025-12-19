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
    geminiKeyLoaded: !!process.env.GEMINI_API_KEY
  });
});

/* =====================
   ROUTES
===================== */
const documentsRoutes = require("./routes/documents");
const queriesRoutes = require("./routes/queries");
const analyticsRoutes = require("./routes/analytics");

app.use("/api/documents", documentsRoutes);
app.use("/api/queries", queriesRoutes);
app.use("/api/analytics", analyticsRoutes);

/* =====================
   ERROR HANDLER
===================== */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

/* =====================
   START SERVER
===================== */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("🚀 Prompt2Support backend running");
  console.log(`✅ Port: ${PORT}`);
  console.log(`✅ Gemini key loaded: ${!!process.env.GEMINI_API_KEY}`);
});

module.exports = app;
