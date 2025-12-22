import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 8000;

// In-memory storage
let uploadedDocuments = [];
let documentContents = new Map();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(process.cwd(), "frontend", "build");
  console.log("Serving frontend from:", frontendPath);
  app.use(express.static(frontendPath));
}

// Multer config
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowed = [".txt", ".docx", ".pdf"];
    cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
  },
});

// Read file content
const readFileContent = (filePath, originalName) => {
  try {
    if (originalName.endsWith(".txt")) {
      return fs.readFileSync(filePath, "utf8");
    }
    return `Demo content from ${originalName}`;
  } catch {
    return "";
  }
};

// Routes
app.post("/api/documents/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const content = readFileContent(req.file.path, req.file.originalname);
  const doc = {
    id: Date.now().toString(),
    name: req.file.originalname,
    uploadedAt: new Date(),
  };

  uploadedDocuments.push(doc);
  documentContents.set(doc.id, content);

  res.json({ success: true, document: doc });
});

app.post("/api/queries", (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query required" });

  for (const content of documentContents.values()) {
    if (content.toLowerCase().includes(query.toLowerCase())) {
      return res.json({
        success: true,
        answer: content.slice(0, 200),
      });
    }
  }

  res.json({
    success: true,
    answer: "Please upload documents to get specific answers.",
  });
});

// React fallback
if (process.env.NODE_ENV === "production") {
  app.get("*", (_, res) => {
    res.sendFile(
      path.join(process.cwd(), "frontend", "build", "index.html")
    );
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
