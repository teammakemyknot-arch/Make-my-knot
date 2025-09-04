const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createSendToken } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

// Generate random token
const createRandomToken = () => crypto.randomBytes(32).toString('hex');

const signUp = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      dateOfBirth,
      phoneNumber,
      agreeToTerms
    } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match'
      });
    }

    // Check if user agreed to terms
    if (!agreeToTerms) {
      return res.status(400).json({
        status: 'fail',
        message: 'You must agree to the terms and conditions'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User with this email already exists'
      });
    }

    // Generate email verification token
    const emailVerificationToken = createRandomToken();
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      dateOfBirth: new Date(dateOfBirth),
      phoneNumber,
      verification: {
        isEmailVerified: false,
        emailVerificationToken,
        emailVerificationExpires
      }
    });

    // Send verification email
    try {
      const verifyURL = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${emailVerificationToken}`;
      
      await sendEmail({
        to: newUser.email,
        subject: 'Welcome to MakeMyKnot! Please verify your email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to MakeMyKnot!</h2>
            <p>Hi ${newUser.firstName},</p>
            <p>Thank you for joining MakeMyKnot! To complete your registration, please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyURL}" style="background-color: #ff4458; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>${verifyURL}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with MakeMyKnot, please ignore this email.</p>
            <p>Best regards,<br>The MakeMyKnot Team</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    // Send response with token (but user still needs to verify email)
    createSendToken(newUser, 201, res, 'Registration successful! Please check your email to verify your account.');
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed. Please try again.'
    });
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Check if user is suspended
    if (user.suspendedUntil && user.suspendedUntil > new Date()) {
      return res.status(403).json({
        status: 'fail',
        message: `Your account is suspended until ${user.suspendedUntil}. Reason: ${user.suspensionReason || 'Not specified'}`
      });
    }

    // Update last active
    user.updateLastActive();

    // Send token to client
    createSendToken(user, 200, res, 'Login successful!');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed. Please try again.'
    });
  }
};

const logout = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('matches.user', 'firstName lastName profilePicture age');
    
    res.status(200).json({
      status: 'success',
      user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user data'
    });
  }
};

const updateMe = async (req, res, next) => {
  try {
    // Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'This route is not for password updates. Please use /change-password.'
      });
    }

    // Filter out unwanted fields
    const allowedFields = [
      'firstName', 'lastName', 'bio', 'phoneNumber', 'profilePicture',
      'preferences', 'location', 'settings'
    ];
    
    const filteredBody = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        filteredBody[field] = req.body[field];
      }
    });

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update me error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    // Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'There is no user with that email address.'
      });
    }

    // Generate the random reset token
    const resetToken = createRandomToken();
    const resetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetPassword = {
      token: crypto.createHash('sha256').update(resetToken).digest('hex'),
      expires: resetTokenExpires
    };
    await user.save({ validateBeforeSave: false });

    // Send it to user's email
    try {
      const resetURL = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

      await sendEmail({
        to: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>Hi ${user.firstName},</p>
            <p>You requested a password reset for your MakeMyKnot account. Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetURL}" style="background-color: #ff4458; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>${resetURL}</p>
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
            <p>Best regards,<br>The MakeMyKnot Team</p>
          </div>
        `
      });

      res.status(200).json({
        status: 'success',
        message: 'Password reset link sent to email!'
      });
    } catch (err) {
      user.resetPassword = {
        token: undefined,
        expires: undefined
      };
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: 'error',
        message: 'There was an error sending the email. Try again later.'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process password reset request'
    });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    // Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      'resetPassword.token': hashedToken,
      'resetPassword.expires': { $gt: Date.now() }
    });

    // If token has not expired, and there is user, set the new password
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }

    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match'
      });
    }

    user.password = newPassword;
    user.resetPassword = {
      token: undefined,
      expires: undefined
    };
    user.passwordChangedAt = new Date();
    await user.save();

    // Log the user in, send JWT
    createSendToken(user, 200, res, 'Password reset successful!');
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reset password'
    });
  }
};

const changePassword = async (req, res, next) => {
  try {
    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.oldPassword, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your current password is wrong.'
      });
    }

    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'New passwords do not match'
      });
    }

    // If so, update password
    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    // Log user in, send JWT
    createSendToken(user, 200, res, 'Password changed successfully!');
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to change password'
    });
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Find user with this verification token that hasn't expired
    const user = await User.findOne({
      'verification.emailVerificationToken': token,
      'verification.emailVerificationExpires': { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }

    // Mark email as verified
    user.verification.isEmailVerified = true;
    user.verification.emailVerificationToken = undefined;
    user.verification.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully!'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify email'
    });
  }
};

const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that email address'
      });
    }

    if (user.verification.isEmailVerified) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const emailVerificationToken = createRandomToken();
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    user.verification.emailVerificationToken = emailVerificationToken;
    user.verification.emailVerificationExpires = emailVerificationExpires;
    await user.save({ validateBeforeSave: false });

    // Send verification email
    try {
      const verifyURL = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${emailVerificationToken}`;

      await sendEmail({
        to: user.email,
        subject: 'MakeMyKnot - Verify your email address',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Email Verification</h2>
            <p>Hi ${user.firstName},</p>
            <p>Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyURL}" style="background-color: #ff4458; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>${verifyURL}</p>
            <p>This link will expire in 24 hours.</p>
            <p>Best regards,<br>The MakeMyKnot Team</p>
          </div>
        `
      });

      res.status(200).json({
        status: 'success',
        message: 'Verification email sent!'
      });
    } catch (emailError) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to send verification email'
      });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to resend verification email'
    });
  }
};

module.exports = {
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
};
