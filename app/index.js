import express from "express";
import { loginRouter } from "../routes/login.js";
import passport from "passport";
import "../middlewares/google.js";
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';
import session from 'express-session'; 


const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use(
  "/auth",
  passport.authenticate("auth-google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    session: true,
    failureRedirect: "/unauthorized"
  }),
  loginRouter
);

app.get('/logout', (req, res, next) => {
  res.clearCookie('connect.sid'); 
  res.clearCookie('userData'); 
	req.logout(function(err) {
		console.log(err)
		req.session.destroy(function (err) { // destroys the session
			res.redirect('/auth')
		});
	});

});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/home', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/home.html'));
});

app.listen(3000, () => console.log("http://localhost:3000/auth"));


