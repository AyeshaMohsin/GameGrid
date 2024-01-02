const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BlacklistedAccessToken = require("../models/BlacklistedAccessToken");
const BlacklistedRefreshToken = require("../models/BlacklistedRefreshToken");

// Helper functions

const removePassword = (user) => {
  const { password, ...userWithoutPass } = user;
  return userWithoutPass;
};

const generateAccessToken = (user) => {
  const userWithoutPass = removePassword(user);
  return jwt.sign(userWithoutPass, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION,
  });
};

const generateRefreshToken = (user) => {
  const userWithoutPass = removePassword(user);
  return jwt.sign(userWithoutPass, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already Registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      fullName,
      email,
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const user_object = user.toObject();

    const accessToken = generateAccessToken(user_object);
    const refreshToken = generateRefreshToken(user_object);

    const userWithoutPass = removePassword(user_object);

    const response = {
      success: true,
      user: userWithoutPass,
      accessToken,
      refreshToken,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if(req.user.email != email){
      return res.status(401).json("You can only change your own password.");;
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "email not registered." });
    }

    // Check the current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await User.updateOne({ email }, { $set: { password: hashedNewPassword } });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.refresh = async (req, res) => {
  console.log("fucking refresh route");
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json("No refresh Token.");
  }

  const isBlacklisted = await BlacklistedRefreshToken.exists({
    token: refreshToken,
  });

  if (isBlacklisted) {
    console.log("Refresh token is blacklisted");
    return res.status(400).json({ message: "Expired Refresh Token." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log("decoded: ", decoded);

    if (decoded) {
      const user = await User.findById(decoded._id);
      const user_object = user.toObject();
      const accessToken = generateAccessToken(user_object);
      return res.status(200).json({ accessToken });
    }
  } catch (err) {
    console.log(err);
    return res.status(501).json("internal server error.");
  }
};

exports.logout = async (req, res) => {
  const accessToken = req.accessToken;
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    res.status(400).send("You need to send refreshToken.");
  }

  try {
    // Check if the token is valid and not already blacklisted
    const aToken = await BlacklistedAccessToken.findOne({ token: accessToken });
    const rToken = await BlacklistedRefreshToken.findOne({
      token: refreshToken,
    });

    if (aToken && rToken) {
      return res.status(200).json({ message: "Logout successful" });
    }

    // If they're not blacklisted, findout their expiration and blacklist

    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );
    await BlacklistedAccessToken.create({
      token: accessToken,
      expiresAt: new Date(decodedAccessToken.exp * 1000), // Convert expiration time to milliseconds
    });

    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
    await BlacklistedRefreshToken.create({
      token: refreshToken,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error blacklisting token:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Testing purposes
exports.protected = async (req, res) => {
  console.log("Private route accessed !");
  res.json({ message: "This is a protected route", user: req.user });
};
