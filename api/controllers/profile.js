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

    // Check if the profile is deactivated
    if (!user.active) {
      return res.status(403).json({ message: "You cannot view this account." });
    }

    return res.status(200).json({ profile: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update my Profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, description, private } = req.body;

    // Validate if any of the required fields are missing
    if (!fullName && !description && private === undefined) {
      return res
        .status(400)
        .json({ message: "No valid update fields provided" });
    }

    const updatedFields = {};

    if (fullName) {
      updatedFields.fullName = fullName;
    }

    if (description) {
      updatedFields.description = description;
    }

    if (private !== undefined) {
      updatedFields.private = private;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updatedFields,
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json({ message: "Profile updated successfully", profile: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// See my followers
exports.myFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "followers",
      "fullName username"
    );
    return res.status(200).json({ followers: user.followers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// See my following
exports.myFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "following",
      "fullName username"
    );
    return res.status(200).json({ following: user.following });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Deactivate my account
exports.deactivateAccount = async (req, res) => {
  try {
    // Deactivate account by changing the active attribute to false
    await User.findByIdAndUpdate(req.user._id, { active: false });
    return res
      .status(200)
      .json({ message: "Account deactivated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Make my account private
exports.makeAccountPrivate = async (req, res) => {
  try {
    // Make account private by changing the private attribute to true
    await User.findByIdAndUpdate(req.user._id, { private: true });
    return res
      .status(200)
      .json({ message: "Account set to private successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// See anyone's followers
exports.viewFollowers = async (req, res) => {
  try {
    const userId = req.params.userId; 
    const user = await User.findById(userId).select("-password");

    // Check if the profile is private or deactivated
    if (user.private || !user.active) {
      return res.status(403).json({ message: "Access denied" });
    }

    const followers = await User.findById(userId).populate(
      "followers",
      "fullName username"
    );
    return res.status(200).json({ followers: followers.followers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// See anyone's following
exports.viewFollowing = async (req, res) => {
  try {
    const userId = req.params.userId; 
    const user = await User.findById(userId).select("-password");

    // Check if the profile is private or deactivated
    if (user.private || !user.active) {
      return res.status(403).json({ message: "Access denied" });
    }

    const following = await User.findById(userId).populate(
      "following",
      "fullName username"
    );
    return res.status(200).json({ following: following.following });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Follow an account
exports.followUser = async (req, res) => {
  try {
    const userIdToFollow = req.params.userId; 
    const userToFollow = await User.findById(userIdToFollow);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user being followed has a private or deactivated profile
    if (userToFollow.private || !userToFollow.active) {
      return res
        .status(403)
        .json({ message: "Cannot follow a private or deactivated account" });
    }

    // Check if the user is already following the target user
    if (req.user.following.includes(userIdToFollow)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    // Update the user's following list and the target user's followers list
    await User.findByIdAndUpdate(req.user._id, {
      $push: { following: userIdToFollow },
    });
    await User.findByIdAndUpdate(userIdToFollow, {
      $push: { followers: req.user._id },
    });

    return res.status(200).json({ message: "You are now following the user" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Unfollow an account
exports.unfollowUser = async (req, res) => {
  try {
    const userIdToUnfollow = req.params.userId; 

    // Check if the user is not already following the target user
    if (!req.user.following.includes(userIdToUnfollow)) {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }

    // Update the user's following list and the target user's followers list
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: userIdToUnfollow },
    });
    await User.findByIdAndUpdate(userIdToUnfollow, {
      $pull: { followers: req.user._id },
    });

    return res.status(200).json({ message: "You have unfollowed the user" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
