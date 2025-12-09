const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

router.post('/process', queryController.processQuery);
router.get('/history', queryController.getHistory);

module.exports = router;