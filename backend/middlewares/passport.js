const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const passport = require("passport");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Extract firstName and lastName from displayName
                const [firstName, ...lastNameParts] = profile.displayName.split(" ");
                const lastName = lastNameParts.join(" ");
                // Check if user already exists
                let user = await User.findOne({ googleId: profile.id });
                // If user does not exist, create a new user
                if (!user) {
                    user = await User.create({
                        firstName: firstName || "FirstName",
                        lastName: lastName || "LastName",
                        email: profile.emails[0].value,
                        password: profile.id,
                        googleId: profile.id,
                        imageurl: profile.photos[0].value,
                    });
                }
                // Return user
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
    User.findById(id, (err, user) => done(err, user))
);
