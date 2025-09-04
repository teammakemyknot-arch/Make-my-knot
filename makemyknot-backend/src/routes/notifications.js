const express = require('express');
const AdminNotification = require('../models/AdminNotification');
const { protect } = require('../middleware/auth');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/notifications - Get user notifications
router.get('/', catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    type, 
    unreadOnly = false,
    includeExpired = false 
  } = req.query;
  
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    type,
    unreadOnly: unreadOnly === 'true',
    includeExpired: includeExpired === 'true'
  };
  
  const notifications = await AdminNotification.getUserNotifications(req.user.id, options);
  const total = await AdminNotification.countDocuments({
    userId: req.user.id,
    isActive: true,
    ...(type && { type }),
    ...(unreadOnly === 'true' && { read: false })
  });
  
  res.json({
    status: 'success',
    results: notifications.length,
    data: {
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// GET /api/notifications/stats - Get notification statistics
router.get('/stats', catchAsync(async (req, res) => {
  const stats = await AdminNotification.getStats(req.user.id);
  
  res.json({
    status: 'success',
    data: {
      stats: stats[0] // aggregate returns array with one result
    }
  });
}));

// GET /api/notifications/:id - Get single notification
router.get('/:id', catchAsync(async (req, res, next) => {
  const notification = await AdminNotification.findOne({
    _id: req.params.id,
    userId: req.user.id,
    isActive: true
  }).populate('sentBy', 'firstName lastName email');
  
  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }
  
  res.json({
    status: 'success',
    data: {
      notification
    }
  });
}));

// POST /api/notifications - Create notification (admin only)
router.post('/', catchAsync(async (req, res) => {
  const { 
    userId, 
    title, 
    message, 
    type = 'info', 
    priority = 'medium',
    category = 'general',
    actionUrl,
    actionText,
    expiresAt,
    metadata = {}
  } = req.body;
  
  const notification = await AdminNotification.create({
    userId,
    title,
    message,
    type,
    priority,
    category,
    actionUrl,
    actionText,
    expiresAt,
    metadata,
    sentBy: req.user.id
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      notification
    }
  });
}));

// POST /api/notifications/broadcast - Send notification to multiple users (admin only)
router.post('/broadcast', catchAsync(async (req, res) => {
  const { 
    userIds = [], 
    title, 
    message, 
    type = 'info', 
    priority = 'medium',
    category = 'general',
    actionUrl,
    actionText,
    expiresAt,
    metadata = {}
  } = req.body;
  
  // Create notifications for all specified users
  const notifications = userIds.map(userId => ({
    userId,
    title,
    message,
    type,
    priority,
    category,
    actionUrl,
    actionText,
    expiresAt,
    metadata,
    sentBy: req.user.id
  }));
  
  const createdNotifications = await AdminNotification.insertMany(notifications);
  
  res.status(201).json({
    status: 'success',
    data: {
      notifications: createdNotifications,
      count: createdNotifications.length
    }
  });
}));

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/:id/read', catchAsync(async (req, res, next) => {
  const notification = await AdminNotification.findOne({
    _id: req.params.id,
    userId: req.user.id,
    isActive: true
  });
  
  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }
  
  await notification.markAsRead();
  
  res.json({
    status: 'success',
    data: {
      notification
    }
  });
}));

// PATCH /api/notifications/read-all - Mark all notifications as read
router.patch('/read-all', catchAsync(async (req, res) => {
  const { type } = req.body;
  
  const filter = {
    userId: req.user.id,
    read: false,
    isActive: true
  };
  
  if (type) {
    filter.type = type;
  }
  
  const result = await AdminNotification.updateMany(
    filter,
    { 
      $set: { 
        read: true, 
        readAt: new Date() 
      } 
    }
  );
  
  res.json({
    status: 'success',
    data: {
      modifiedCount: result.modifiedCount
    }
  });
}));

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', catchAsync(async (req, res, next) => {
  const notification = await AdminNotification.findOne({
    _id: req.params.id,
    userId: req.user.id,
    isActive: true
  });
  
  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }
  
  notification.isActive = false;
  await notification.save();
  
  res.status(204).json({
    status: 'success',
    data: null
  });
}));

// DELETE /api/notifications/cleanup - Delete expired notifications (admin only)
router.delete('/cleanup', catchAsync(async (req, res) => {
  const result = await AdminNotification.cleanupExpired();
  
  res.json({
    status: 'success',
    data: {
      deletedCount: result.deletedCount
    }
  });
}));

module.exports = router;
