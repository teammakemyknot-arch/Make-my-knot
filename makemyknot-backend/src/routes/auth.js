const express = require('express');
const { protect } = require('../middleware/auth');
const {
  signUp,
  signIn,
  logout,
  getMe,
  updateMe,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  resendVerificationEmail
} = require('../controllers/authController');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', signUp);
router.post('/login', signIn);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Protected routes (authentication required)
router.use(protect); // All routes after this middleware are protected

router.get('/me', getMe);
router.patch('/profile', updateMe);
router.patch('/change-password', changePassword);

module.exports = router;
