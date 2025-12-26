import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import axios from "axios";
import vectorStore from "../services/vectorStore.js";

const router = express.Router();
const upload = multer({ dest: "uploads/tmp" });

// In-memory document storage for tracking
let uploadedDocuments = [];

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, error: "No file uploaded" });
    }

    console.log(`📤 Processing document: ${req.file.originalname}`);
    console.log(`📋 Mimetype: ${req.file.mimetype}, Size: ${req.file.size}`);

    let extractedText = '';

    // Handle different file types
    if (req.file.mimetype === 'text/plain' || req.file.originalname.toLowerCase().endsWith('.txt')) {
      // For text files, read directly
      extractedText = fs.readFileSync(req.file.path, 'utf-8');
      console.log(`📄 Read text file directly: ${extractedText.length} characters`);
      console.log(`📝 First 200 chars: ${extractedText.substring(0, 200)}`);
    } else if (req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf')) {
      // For PDFs, try Gemini Vision API
      try {
        const buffer = fs.readFileSync(req.file.path);
        const base64 = buffer.toString("base64");

        const response = await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
          {
            contents: [
              {
                role: "user",
                parts: [
                  { text: "Extract all readable text from this document. Return only the text content without any explanations or formatting." },
                  {
                    inlineData: {
                      mimeType: req.file.mimetype,
                      data: base64,
                    },
                  },
                ],
              },
            ],
          },
          {
            params: { key: process.env.GEMINI_API_KEY },
          }
        );

        extractedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } catch (visionError) {
        console.log(`⚠️ Vision API failed for PDF, using fallback`);
        extractedText = `Content from PDF file: ${req.file.originalname} - PDF processing requires vision API access. Please use text files for now.`;
      }
    } else {
      // For other file types, provide a generic message
      extractedText = `Content from ${req.file.originalname} - File type ${req.file.mimetype} uploaded but not processed.`;
    }

    if (!extractedText || extractedText.trim().length < 5) {
      fs.unlinkSync(req.file.path); // Clean up temp file
      return res.json({
        success: false,
        error: "Could not extract readable text from the document"
      });
    }

    // Create document metadata
    const docId = Date.now().toString();
    const documentMetadata = {
      id: docId,
      filename: req.file.originalname,
      uploadedAt: new Date().toISOString(),
      size: req.file.size,
      type: req.file.mimetype
    };

    // Add document to vector store
    await vectorStore.addDocument({
      text: extractedText.trim(),
      metadata: documentMetadata
    });

    // Track uploaded documents
    uploadedDocuments.push(documentMetadata);

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    console.log(`✅ Document processed: ${req.file.originalname} (${extractedText.length} chars, ${vectorStore.vectors.length} total chunks)`);

    res.json({
      success: true,
      filename: req.file.originalname,
      documentId: docId,
      extractedLength: extractedText.length,
      totalDocuments: uploadedDocuments.length
    });
  } catch (err) {
    console.error("❌ Document upload error:", err.message);

    // Clean up temp file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      success: false,
      error: "Failed to process document: " + err.message
    });
  }
});

// Get list of uploaded documents
router.get("/", (req, res) => {
  res.json({
    success: true,
    documents: uploadedDocuments,
    totalChunks: vectorStore.vectors.length
  });
});

export default router;
