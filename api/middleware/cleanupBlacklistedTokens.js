const BlacklistedAccessToken = require('../models/BlacklistedAccessToken.js'); 

function cleanupExpiredTokens() {
  setInterval(async () => {
    const expiredTokens = await BlacklistedAccessToken.find({
      expiresAt: { $lt: new Date() },
    });

    if (expiredTokens.length > 0) {
      await BlacklistedAccessToken.deleteMany({
        _id: { $in: expiredTokens.map((token) => token._id) },
      });

      console.log(`Removed ${expiredTokens.length} expired tokens from BlacklistedAccessTokens collection.`);
    }
  }, process.env.JWT_ACCESS_EXPIRATION);
}

// Call the function to start the cleanup process
cleanupExpiredTokens();