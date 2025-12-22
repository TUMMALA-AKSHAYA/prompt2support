import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 8000;

// --------------------
// In-memory storage (demo)
// --------------------
let uploadedDocuments = [];
let documentContents = new Map();

// --------------------
// Middleware
// --------------------
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// --------------------
// Multer config
// --------------------
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowed = [".txt", ".docx", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

// --------------------
// Helper: Read file content
// --------------------
const readFileContent = (filePath, originalName) => {
  try {
    const ext = path.extname(originalName).toLowerCase();
    if (ext === ".txt") {
      return fs.readFileSync(filePath, "utf8");
    }
    // DOCX / PDF placeholder
    return `Content extracted from ${originalName}`;
  } catch (error) {
    console.error("File read error:", error);
    return "";
  }
};

// --------------------
// Helper: Search documents
// --------------------
const searchInDocuments = (query) => {
  const results = [];
  const q = query.toLowerCase();

  for (const [docId, content] of documentContents.entries()) {
    if (content.toLowerCase().includes(q)) {
      results.push({
        docId,
        snippet: content.substring(0, 200) + "...",
        relevance: 1,
      });
    }
  }
  return results;
};

// --------------------
// Routes
// --------------------

// Upload document
app.post("/api/documents/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const content = readFileContent(req.file.path, req.file.originalname);

    const doc = {
      id: Date.now().toString(),
      name: req.file.originalname,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    uploadedDocuments.push(doc);
    documentContents.set(doc.id, content);

    console.log("📄 Uploaded:", doc.name);

    res.json({
      success: true,
      document: doc,
      documents: uploadedDocuments,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Query endpoint
app.post("/api/queries", (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    console.log("❓ Query:", query);

    const matches = searchInDocuments(query);

    if (matches.length > 0) {
      return res.json({
        success: true,
        answer: `Based on your documents: ${matches[0].snippet}`,
        source: "documents",
      });
    }

    // Demo fallback responses
    if (query.toLowerCase().includes("return")) {
      return res.json({
        success: true,
        answer:
          "Products can be returned within 30 days of delivery. Defective products must be reported within 15 days.",
        source: "demo",
      });
    }

    if (query.toLowerCase().includes("track")) {
      return res.json({
        success: true,
        answer:
          "You can track your order using the tracking number sent to your email.",
        source: "demo",
      });
    }

    res.json({
      success: false,
      answer: "No relevant information found. Please upload documents.",
      source: "no_match",
    });
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// --------------------
// Start server
// --------------------
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
