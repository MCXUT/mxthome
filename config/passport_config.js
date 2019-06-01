const passport = require("passport");
const LocalStrategy = require("passport-local");
//Facebook
const FacebookStrategy = require("passport-facebook").Strategy;

const User = require("../models/User");

// login passport
passport.use(
    "local-login", new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, (username, password, done) => {
        User.getUserByUsername(username, (err, user) => {
            if(err) throw err;
            if(!user) {
                return done(null, false, {message: "Invalid Username or Password"});
            }

            User.comparePassword(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(!isMatch) {
                    return done(null, false, {message: "Invalid Username or Password"});
                } else {
                    return done(null, user);
                }
            });
        });
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

const fKeys = require("../config/keys");

passport.use(
  new FacebookStrategy({
    clientID: fKeys.facebookClientInfo.cId,
    clientSecret: fKeys.facebookClientInfo.cPw,
    callbackURL : "https://crewmxt.com/auth/facebook/callback",
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, profile, done) => {
    User.findOne({id: profile.id}, (err, user) => {
      if(user) {return done(err,user);} // ID 가 있으면 로그인
      const newUser = newUser({
        id: profile.id
      }); //ID가 없으면 회원생성
      newUser.save((user) => {
        return done(null, user); // 새로운 회원 생성 후 로그인
    });
  });
}));

module.exports = passport;
