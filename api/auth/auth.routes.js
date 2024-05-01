const express = require('express')
const { login, signup, logout, googleLoginSignup, verifyToken } = require('./auth.controller')
const authService = require('./auth.service')


const router = express.Router()
const passport = require("passport");


router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)
router.post('/login/google', googleLoginSignup)
router.get('/verifyToken', verifyToken)

//google sign

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

// Route for initiating Google OAuth
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {
//   console.log(' res', res)
//   console.log('test')
// });

// Route for handling the callback from Google
// router.get('/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login/failed' }),
//   (req, res) => {
//     console.log('pass')
//     // Successful authentication, redirect to your desired frontend page
//     res.redirect('/');
//   });

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/google/callback",
  passport.authenticate('google', { failureRedirect: '/login/failed' }),
  (req, res) => {
    // console.log('req.user', req.user)
    // Assuming `getLoginToken` creates a JWT or similar token
    const loginToken = authService.getLoginToken(req.user);
    res.cookie('loginToken', loginToken, { httpOnly: true, sameSite: 'Strict', secure: true }); // secure: true in production
    // Redirect to a frontend route that can handle the logged-in state
    res.redirect(`${process.env.CLIENT_URL}/#/${req.user._id}`); // check if need the #
  });

module.exports = router
