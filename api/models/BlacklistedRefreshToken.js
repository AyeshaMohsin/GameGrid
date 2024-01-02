// models/BlacklistedRefreshToken.js

const mongoose = require('mongoose');

const blacklistedRefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

const BlacklistedRefreshToken = mongoose.model('BlacklistedRefreshToken', blacklistedRefreshTokenSchema);

module.exports = BlacklistedRefreshToken;
