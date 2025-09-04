const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  matchedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  },
  compatibility: {
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    factors: {
      values: Number,
      lifestyle: Number,
      interests: Number,
      location: Number,
      age: Number
    }
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
matchSchema.index({ users: 1 });
matchSchema.index({ matchedAt: -1 });
matchSchema.index({ status: 1 });

// Static method to find matches for a user
matchSchema.statics.findUserMatches = function(userId) {
  return this.find({
    users: userId,
    status: 'active'
  }).populate('users', '-password').sort('-matchedAt');
};

module.exports = mongoose.model('Match', matchSchema);
