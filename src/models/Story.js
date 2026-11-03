const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  story: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "Anonymous",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  beforeWeight: { type: Number },
  afterWeight: { type: Number },
  duration: { type: String, default: '3 months' },
  isApproved: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Story', StorySchema);
