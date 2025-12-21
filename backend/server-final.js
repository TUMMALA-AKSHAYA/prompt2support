import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 8000;

// In-memory storage
let uploadedDocuments = [];
let documentContents = new Map();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Multer config
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowed = [".txt", ".docx", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

// Helper function to read file content
const readFileContent = (filePath, originalName) => {
  try {
    const ext = path.extname(originalName).toLowerCase();
    if (ext === '.txt') {
      return fs.readFileSync(filePath, 'utf8');
    }
    return `Content from ${originalName} - Demo content for testing`;
  } catch (error) {
    return '';
  }
};

// Search function
const searchInDocuments = (query) => {
  const results = [];
  const queryLower = query.toLowerCase();
  
  for (const [docId, content] of documentContents.entries()) {
    const contentLower = content.toLowerCase();
    if (contentLower.includes(queryLower)) {
      results.push({
        docId,
        content: content.substring(0, 200) + '...',
        relevance: 1
      });
    }
  }
  return results;
};

// Routes
app.post("/api/documents/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

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

    console.log("📄 Uploaded:", doc.name, "- Content length:", content.length);

    res.json({
      success: true,
      message: "File uploaded successfully",
      document: doc,
      documents: uploadedDocuments,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.post("/api/queries", (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    console.log("❓ User query:", query);

    // Search in uploaded documents first
    const documentResults = searchInDocuments(query);
    
    if (documentResults.length > 0) {
      const firstMatch = documentResults[0];
      return res.json({
        success: true,
        answer: `Based on your uploaded documents: ${firstMatch.content}`,
        source: "uploaded_documents"
      });
    }

    // Fallback responses
    if (query.toLowerCase().includes("return")) {
      return res.json({
        success: true,
        answer: "Products can be returned within 30 days of delivery. Defective products must be reported within 15 days.",
        source: "demo_response"
      });
    }

    if (query.toLowerCase().includes("track")) {
      return res.json({
        success: true,
        answer: "You can track your order using the tracking number sent to your email.",
        source: "demo_response"
      });
    }

    return res.json({
      success: false,
      answer: "Please upload some documents first so I can help you with specific information.",
      source: "no_match"
    });
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ 
      success: false,
      error: "There was an issue processing your request. Please try again." 
    });
  }
});

app.get("/", (req, res) => {
  res.send("🚀 Prompt2Support backend running on port " + PORT);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`✅ Upload endpoint: http://localhost:${PORT}/api/documents/upload`);
  console.log(`✅ Query endpoint: http://localhost:${PORT}/api/queries`);
});