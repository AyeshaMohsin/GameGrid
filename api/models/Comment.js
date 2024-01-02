const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  images: [{
    type: String, // image URLs are stored as strings
  }],
  audio: [{
    type: String, // audio file URLs are stored as strings
  }],
  video: [{
    type: String, // video URLs are stored as strings
  }],
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment', 
  }],
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
