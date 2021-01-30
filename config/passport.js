const passport = require("passport");
const config = require("./oauth");
const User = require("../models/");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
const { generateToken, setUser } = require("../helper");
const secretOrKey = process.env.secretJWT;

passport.serializeUser((user, done) => {
  console.log(user);

  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Option Jwt
const opts = {
  jwtFromRequest,
  secretOrKey,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    const user = await User.findOne({ _id: jwt_payload._id });
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  })
);

module.exports = passport;
