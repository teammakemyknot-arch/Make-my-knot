const mongoose = require('mongoose');

const adminNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'error', 'system', 'marketing'],
    default: 'info',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['user_activity', 'system', 'marketing', 'moderation', 'billing', 'general'],
    default: 'general'
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: Date,
  actionUrl: String, // URL to redirect when notification is clicked
  actionText: String, // Text for action button
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  expiresAt: Date,
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
adminNotificationSchema.index({ userId: 1, read: 1 });
adminNotificationSchema.index({ createdAt: -1 });
adminNotificationSchema.index({ type: 1, priority: 1 });
adminNotificationSchema.index({ expiresAt: 1 });

// Virtual for notification age
adminNotificationSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (60 * 1000)); // in minutes
});

// Virtual for checking if notification is expired
adminNotificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

// Pre-save middleware to set readAt when read status changes
adminNotificationSchema.pre('save', function(next) {
  if (this.isModified('read') && this.read && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

// Instance method to mark as read
adminNotificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to get user notifications with pagination
adminNotificationSchema.statics.getUserNotifications = function(userId, options = {}) {
  const {
    page = 1,
    limit = 10,
    type = null,
    unreadOnly = false,
    includeExpired = false
  } = options;

  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    isActive: true
  };

  if (type) match.type = type;
  if (unreadOnly) match.read = false;
  if (!includeExpired) {
    match.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ];
  }

  return this.aggregate([
    { $match: match },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: 'sentBy',
        foreignField: '_id',
        as: 'sender',
        pipeline: [
          { $project: { firstName: 1, lastName: 1, email: 1 } }
        ]
      }
    }
  ]);
};

// Static method to get notification stats
adminNotificationSchema.statics.getStats = function(userId) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true
      }
    },
    {
      $facet: {
        total: [{ $count: "count" }],
        unread: [
          { $match: { read: false } },
          { $count: "count" }
        ],
        byType: [
          { $group: { _id: "$type", count: { $sum: 1 } } }
        ],
        byPriority: [
          { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]
      }
    }
  ]);
};

// Static method to cleanup expired notifications
adminNotificationSchema.statics.cleanupExpired = function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() },
    isActive: true
  });
};

module.exports = mongoose.model('AdminNotification', adminNotificationSchema);
