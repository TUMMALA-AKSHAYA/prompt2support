const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// ✅ Proper Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ✅ Upload route
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("Uploaded:", req.file.originalname);

  res.json({
    success: true,
    filename: req.file.originalname
  });
});

module.exports = router;
