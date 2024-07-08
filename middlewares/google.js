import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { config } from "dotenv";


config();

const emails = ["ebetancurpalacio@gmail.com"];

passport.use(
  "auth-google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://qcraks-auth.onrender.com/auth/google",
    },
    function (accessToken, refreshToken, profile, done) {
      const response = emails.includes(profile.emails[0].value);

      profile.accessToken = accessToken;
      // IF EXITS IN DATABASE
      if (response) {
        done(null, profile);
      } else {
        // SAVE IN DATABASE
        emails.push(profile.emails[0].value);
        done(null, profile);
      }

      console.log("data de google.js:",profile);
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user
passport.deserializeUser((user, done) => {
  done(null, user);
});

