import passport from "passport";
import googleStrategy from "passport-google-oauth20";
import UserModel from "../models/user.schema.js";

// google strategy for signup and signin
passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await UserModel.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new UserModel({
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id,
          password: profile.id,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id); // Store user ID in session
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => {
    done(err, user);
  });
});

export default passport;
