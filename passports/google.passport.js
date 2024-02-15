const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();

module.exports = new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.HOSTING}/auth/google/callback`,
      scope: ["profile", "email"],
    },
    function (request, accessToken, refreshToken, profile, done) {
      done(null, profile);
    },
  );
