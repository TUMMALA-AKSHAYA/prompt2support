import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 10000;

// In-memory storage (demo)
let uploadedDocuments = [];
let documentContents = new Map();

// Middleware
app.use(cors({ origin: "*" }));
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

// Read file content (demo)
const readFileContent = (filePath, originalName) => {
  try {
    if (originalName.endsWith(".txt")) {
      return fs.readFileSync(filePath, "utf8");
    }
    return `Demo content extracted from ${originalName}`;
  } catch {
    return "";
  }
};

// Search documents
const searchInDocuments = (query) => {
  const q = query.toLowerCase();
  for (const content of documentContents.values()) {
    if (content.toLowerCase().includes(q)) {
      return content.slice(0, 200) + "...";
    }
  }
  return null;
};

// Routes
app.post("/api/documents/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const content = readFileContent(req.file.path, req.file.originalname);
  const doc = {
    id: Date.now().toString(),
    name: req.file.originalname,
  };

  uploadedDocuments.push(doc);
  documentContents.set(doc.id, content);

  res.json({ success: true, document: doc });
});

app.post("/api/queries", (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query required" });

  const match = searchInDocuments(query);
  if (match) {
    return res.json({
      success: true,
      answer: `From uploaded documents: ${match}`,
    });
  }

  return res.json({
    success: true,
    answer: "Please upload documents to get specific answers.",
  });
});

// Health check
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
