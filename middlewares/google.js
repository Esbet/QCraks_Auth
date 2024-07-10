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
      const email = profile.emails[0].value;
      const domain = email.split('@')[1];

      if (domain === 'quind.io') {
        profile.accessToken = accessToken;

        if (!emails.includes(email)) {
          emails.push(email);
        }

        return done(null, profile);
      } else {
        return done(null, false, { message: 'Domain not authorized' });
      }
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
