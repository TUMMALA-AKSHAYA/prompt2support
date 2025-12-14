const express = require('express');
const router = express.Router();

router.get('/stats', (req, res) => {
  res.json({ message: 'Analytics coming soon' });
});

module.exports = router;