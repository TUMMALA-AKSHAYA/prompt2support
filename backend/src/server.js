require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create necessary directories
const uploadDir = path.join(__dirname, '../uploads');
const vectorDir = path.join(__dirname, '../vectors');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(vectorDir)) {
  fs.mkdirSync(vectorDir, { recursive: true });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    geminiKeyLoaded: !!process.env.GEMINI_API_KEY,
    port: process.env.PORT || 5001
  });
});

// API Routes
const documentsRoutes = require('./routes/documents');
const queriesRoutes = require('./routes/queries');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/documents', documentsRoutes);
app.use('/api/queries', queriesRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`\n🚀 PROMPT2SUPPORT BACKEND`);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Gemini API key: ${process.env.GEMINI_API_KEY ? 'LOADED' : 'MISSING!'}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`\n📡 API Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/documents/upload`);
  console.log(`   GET  http://localhost:${PORT}/api/documents/stats`);
  console.log(`   POST http://localhost:${PORT}/api/queries/process`);
  console.log(`   GET  http://localhost:${PORT}/api/queries/history\n`);
});

module.exports = app;
