const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model'); // Adjust this path if your model file name is different

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Step 1: Query database for existing Google ID
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // Step 2: Create new user if they don't exist yet
            user = new User({
                googleId: profile.id,
                username: profile.displayName || profile.emails[0].value.split('@')[0],
                email: profile.emails[0].value
            });

            await user.save();
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

// Session serialization settings
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});