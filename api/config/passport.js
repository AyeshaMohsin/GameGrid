const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8800/api/auth/google/callback", // this is in routes/auth.js
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      console.log("GoogleStrategy's async function accessed.");
      // executed after sucessful authorization from google
      try {
        // Check if the user already exists in your database
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If the user doesn't exist, create a new user
          user = new User({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : "",
            username: profile.name.givenName,
            password: profile.id,
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
