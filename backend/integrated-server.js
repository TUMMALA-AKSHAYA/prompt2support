import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 9001; // Use port 9001

// Storage
let uploadedDocuments = [];
let documentContents = new Map();

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Multer setup
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowed = [".txt", ".docx", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

// File reading helper
const readFileContent = (filePath, originalName) => {
  try {
    const ext = path.extname(originalName).toLowerCase();
    if (ext === '.txt') {
      return fs.readFileSync(filePath, 'utf8');
    }
    return `Demo content from ${originalName}. In production, this would parse PDF/DOCX files.`;
  } catch (error) {
    console.error('File read error:', error);
    return '';
  }
};

// Search helper
const searchInDocuments = (query) => {
  const results = [];
  const queryLower = query.toLowerCase();
  
  for (const [docId, content] of documentContents.entries()) {
    if (content.toLowerCase().includes(queryLower)) {
      const doc = uploadedDocuments.find(d => d.id === docId);
      results.push({
        docId,
        docName: doc?.name || 'Unknown',
        content: content.substring(0, 300) + '...',
        relevance: 1
      });
    }
  }
  return results;
};

// ROUTES

// Upload endpoint
app.post("/api/documents/upload", upload.single("file"), (req, res) => {
  console.log("📤 Upload request received");
  
  try {
    if (!req.file) {
      console.log("❌ No file in request");
      return res.status(400).json({ 
        success: false, 
        error: "No file uploaded" 
      });
    }

    console.log("📁 Processing file:", req.file.originalname);
    
    const content = readFileContent(req.file.path, req.file.originalname);
    
    const doc = {
      id: Date.now().toString(),
      name: req.file.originalname,
      path: req.file.path,
      uploadedAt: new Date(),
      size: req.file.size
    };

    uploadedDocuments.push(doc);
    documentContents.set(doc.id, content);

    console.log("✅ File uploaded successfully:", doc.name);
    console.log("📊 Total documents:", uploadedDocuments.length);

    res.json({
      success: true,
      message: "File uploaded successfully",
      document: doc,
      documents: uploadedDocuments
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Upload failed: " + error.message 
    });
  }
});

// Query endpoint
app.post("/api/queries", (req, res) => {
  console.log("❓ Query request received");
  
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: "Query is required" 
      });
    }

    console.log("🔍 Processing query:", query);
    console.log("📚 Available documents:", documentContents.size);

    // Search uploaded documents first
    const documentResults = searchInDocuments(query);
    
    if (documentResults.length > 0) {
      console.log("✅ Found matches in documents:", documentResults.length);
      
      const bestMatch = documentResults[0];
      return res.json({
        success: true,
        answer: `Based on your uploaded document "${bestMatch.docName}": ${bestMatch.content}`,
        source: "uploaded_documents",
        matches: documentResults.length
      });
    }

    console.log("🔄 Using fallback responses");

    // Fallback responses
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes("return")) {
      return res.json({
        success: true,
        answer: "Our return policy allows returns within 30 days of purchase. Items must be in original condition.",
        source: "demo_response"
      });
    }

    if (queryLower.includes("track")) {
      return res.json({
        success: true,
        answer: "You can track your order using the tracking number sent to your email or on our website.",
        source: "demo_response"
      });
    }

    if (queryLower.includes("warranty")) {
      return res.json({
        success: true,
        answer: "Products come with a standard 1-year manufacturer warranty.",
        source: "demo_response"
      });
    }

    if (queryLower.includes("emi")) {
      return res.json({
        success: true,
        answer: "Yes, EMI options are available on eligible credit and debit cards.",
        source: "demo_response"
      });
    }

    return res.json({
      success: false,
      answer: documentContents.size > 0 
        ? "I couldn't find specific information about this in your uploaded documents. Please try rephrasing your question."
        : "Please upload some documents first so I can provide specific information.",
      source: "no_match"
    });

  } catch (error) {
    console.error("❌ Query error:", error);
    res.status(500).json({ 
      success: false,
      error: "There was an issue processing your request. Please try again." 
    });
  }
});

// Get documents
app.get("/api/documents", (req, res) => {
  res.json({
    success: true,
    documents: uploadedDocuments,
    count: uploadedDocuments.length
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    port: PORT,
    documents: uploadedDocuments.length,
    timestamp: new Date().toISOString()
  });
});

// Root
app.get("/", (req, res) => {
  res.send(`🚀 Prompt2Support Backend - Port ${PORT} - Documents: ${uploadedDocuments.length}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📤 Upload: http://localhost:${PORT}/api/documents/upload`);
  console.log(`❓ Query: http://localhost:${PORT}/api/queries`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
});