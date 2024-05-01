const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userService = require('./api/user/user.service')

// const FacebookStrategy = require('passport-facebook').Strategy;

// Setup Google Passport Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  scope: ["profile", "email"],
},
  async (accessToken, refreshToken, profile, done) => {
    // console.log('profile', profile)
    let user = await userService.findOrCreateUser({
      googleId: profile.id,
      fullname: profile.displayName,
      username: profile.emails[0].value, // Typically Google profiles provide an email
      imgUrl: profile.photos[0].value
    });
    return done(null, user);
  }
));

// Setup Facebook Passport Strategy
// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: "/auth/facebook/callback",
//     profileFields: ['id', 'displayName', 'photos', 'email']
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     let user = await userService.findOrCreateUser({
//       facebookId: profile.id,
//       fullname: profile.displayName,
//       username: profile.emails[0].value, // Facebook needs permission to access email
//       imgUrl: profile.photos[0].value
//     });
//     return done(null, user);
//   }
// ));

// Serialization and deserialization here if you need sessions
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userService.getById(id);
  done(null, user);
});

module.exports = {
  // existing functions...
  passport
};
