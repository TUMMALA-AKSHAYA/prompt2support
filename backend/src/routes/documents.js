import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import documentProcessor from "../services/documentProcessor.js";
import vectorStore from "../services/vectorStore.js";

const router = express.Router();

// In-memory storage for demo
let uploadedDocuments = [];
let documentContents = new Map(); // Store file contents

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
const readFileContent = async (filePath, originalName) => {
  try {
    const result = await documentProcessor.processDocument(filePath);
    return result.fullText;
  } catch (error) {
    console.error('Error processing file:', error);
    // Fallback to basic reading for TXT
    const ext = path.extname(originalName).toLowerCase();
    if (ext === '.txt') {
      try {
        return fs.readFileSync(filePath, 'utf8');
      } catch (txtError) {
        console.error('Error reading TXT file:', txtError);
        return '';
      }
    }
    return `Error processing ${originalName}: ${error.message}`;
  }
};

// --------------------
// Upload document
// --------------------
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Upload request received");
    if (!req.file) {
      console.log("No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File:", req.file.originalname, "Path:", req.file.path, "Size:", req.file.size);

    // Process document to extract text and chunks
    const processedDoc = await documentProcessor.processDocument(req.file.path);

    console.log("Processed document, text length:", processedDoc.fullText.length, "Chunks:", processedDoc.chunks.length);

    const doc = {
      id: Date.now().toString(),
      name: req.file.originalname,
      path: req.file.path,
      uploadedAt: new Date(),
      size: req.file.size
    };

    uploadedDocuments.push(doc);
    documentContents.set(doc.id, processedDoc.fullText);

    // Add chunks to vector store
    processedDoc.chunks.forEach(chunk => {
      vectorStore.addDocument({
        text: chunk.text,
        metadata: {
          filename: doc.name,
          docId: doc.id,
          chunkIndex: chunk.startChar,
          totalChars: processedDoc.fullText.length
        }
      });
    });

    console.log("📄 Uploaded:", doc.name, "- Content length:", processedDoc.fullText.length, "- Chunks:", processedDoc.chunks.length);

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

// --------------------
// Get uploaded documents
// --------------------
router.get("/", (req, res) => {
  res.json({
    success: true,
    documents: uploadedDocuments,
    count: uploadedDocuments.length
  });
});

// --------------------
// Get document content (for queries)
// --------------------
router.get("/content", (req, res) => {
  const contents = Array.from(documentContents.entries()).map(([id, content]) => {
    const doc = uploadedDocuments.find(d => d.id === id);
    return {
      id,
      name: doc?.name || 'Unknown',
      content: content.substring(0, 500) // First 500 chars for preview
    };
  });
  
  res.json({
    success: true,
    contents
  });
});

// Export document contents for use in queries
export { documentContents };

// ✅ DEFAULT EXPORT
export default router;
