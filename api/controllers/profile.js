// profileController.js

const User = require("../models/User");

// See my profile
exports.myProfile = async (req, res) => {
  return res.status(200).json({ profile: req.user });
};

// See anyone's profile
exports.viewProfile = async (req, res) => {
  try {
    const userId = req.params.userId; 
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if private
    return res.status(200).json({ profile: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update my Profile
exports.updateProfile = async (req, res) => {
  try {
    // Implement profile update logic here based on req.body
    // Example: const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
    return res.status(200).json({ message: "Profile updated successfully", profile: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// See my followers
exports.myFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("followers", "fullName username");
    return res.status(200).json({ followers: user.followers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// See my following
exports.myFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("following", "fullName username");
    return res.status(200).json({ following: user.following });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Deactivate my account
exports.deactivateAccount = async (req, res) => {
  try {
    // Implement account deactivation logic here
    // Example: await User.findByIdAndUpdate(req.user._id, { active: false });
    return res.status(200).json({ message: "Account deactivated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Make my account private
exports.makeAccountPrivate = async (req, res) => {
  try {
    // Implement account privacy update logic here
    // Example: await User.findByIdAndUpdate(req.user._id, { private: true });
    return res.status(200).json({ message: "Account set to private successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// See anyone's followers
exports.viewFollowers = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you are passing the userId as a parameter
    const user = await User.findById(userId).populate("followers", "fullName username");
    return res.status(200).json({ followers: user.followers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// See anyone's following
exports.viewFollowing = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you are passing the userId as a parameter
    const user = await User.findById(userId).populate("following", "fullName username");
    return res.status(200).json({ following: user.following });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
