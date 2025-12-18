const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const DocumentController = require('../controllers/documentController');

// Multer config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|docx|doc|txt/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) return cb(null, true);
    cb(new Error('Unsupported file type'));
  }
});

// ROUTES
router.post('/upload', upload.single('file'), (req, res) =>
  DocumentController.uploadDocument(req, res)
);

router.get('/stats', (req, res) =>
  DocumentController.getStats(req, res)
);

router.get('/list', (req, res) =>
  DocumentController.listDocuments(req, res)
);

router.delete('/:filename', (req, res) =>
  DocumentController.deleteDocument(req, res)
);

module.exports = router;
