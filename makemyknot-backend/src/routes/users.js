const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(protect);

// User profile routes
router.get('/', (req, res) => {
  res.json({ message: 'Users routes - to be implemented' });
});

module.exports = router;
