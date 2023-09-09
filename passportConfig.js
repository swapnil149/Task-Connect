const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Import your User model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://taskconnect12345-e825a4493aff.herokuapp.com/', // Replace with your callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists based on the Google profile ID
        let user = await User.findOne({ googleId: profile.id });
        const googleId = profile.id;
        const displayName = profile.displayName;
        const email = profile.emails[0].value; 

        if (!user) {
          // Create a new user if not found
          user = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            // Other relevant user data...
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

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

module.exports = passport;
