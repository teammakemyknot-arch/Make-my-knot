const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All match routes require authentication
router.use(protect);

// Match routes
router.get('/', (req, res) => {
  res.json({ message: 'Matches routes - to be implemented' });
});

module.exports = router;
