const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String, 
    required : false
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    default: "Hi there, I just started using GameGrid!",
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  private: {
    type: Boolean,
    required: true,
    default: false,
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
