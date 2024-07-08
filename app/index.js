import express from "express";
import { loginRouter } from "../routes/login.js";
import passport from "passport";
import "../middlewares/google.js";
import cookieParser from 'cookie-parser';


const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


// ROUTES
app.use(
  "/auth",
  passport.authenticate("auth-google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    session: false,
    
  }),
  loginRouter
);

app.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.listen(3000, () => console.log("http://localhost:3000/auth"));


