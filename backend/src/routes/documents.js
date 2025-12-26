import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import axios from "axios";

const router = express.Router();
const upload = multer({ dest: "uploads/tmp" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false });
    }

    const buffer = fs.readFileSync(req.file.path);
    const base64 = buffer.toString("base64");

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [
              { text: "Extract all readable text from this document." },
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

    const extracted =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!extracted || extracted.length < 50) {
      return res.json({ success: false });
    }

    const outPath = path.join("uploads", "knowledge.txt");
    fs.mkdirSync("uploads", { recursive: true });
    fs.writeFileSync(outPath, extracted, "utf-8");

    fs.unlinkSync(req.file.path);

    console.log("✅ DOCUMENT INGESTED");

    res.json({ success: true, filename: req.file.originalname });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

export default router;
