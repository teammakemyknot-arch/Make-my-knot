const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All chat routes require authentication
router.use(protect);

// Chat routes
router.get('/', (req, res) => {
  res.json({ message: 'Chat routes - to be implemented' });
});

module.exports = router;
