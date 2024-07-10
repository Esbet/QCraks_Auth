import { Router } from "express";

const loginRouter = Router();

loginRouter.get("/google", (req, res) =>{
    const user = req.user;

    if (user) {
      // define cookies
      const userData = {
        id: user.id,
        displayName: user.displayName,
        email: user.emails[0].value,
        token: user.accessToken,
      };

      // Serialize user data to store in cookie
      const userDataString = JSON.stringify(userData);
      // Set the cookie with the user data
      res.cookie('userData', userDataString, { maxAge: 900000, httpOnly: false });
      // Send a response to the client (optional)
      res.redirect('/home');
    } else {
     // Handling if the user is not authenticated
      res.status(401).json({ error: "User not authenticated" });
    }
}); 


export { loginRouter };

     