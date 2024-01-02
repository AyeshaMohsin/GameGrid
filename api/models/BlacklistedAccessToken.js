const mongoose = require('mongoose');

const blacklistedAccessTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

const BlacklistedAccessToken = mongoose.model('BlacklistedAccessToken', blacklistedAccessTokenSchema);

module.exports = BlacklistedAccessToken;

