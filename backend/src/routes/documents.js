const express = require('express');
const router = express.Router();
const { upload } = require('../server');
const documentController = require('../controllers/documentController');

router.post('/upload', upload.single('document'), documentController.uploadDocument);
router.get('/list', documentController.listDocuments);
router.delete('/:id', documentController.deleteDocument);
router.get('/stats', documentController.getStats);

module.exports = router;