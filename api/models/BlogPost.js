const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  private: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0,
  },
  commentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment', 
  }],
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
