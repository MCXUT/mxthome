const passport = require("passport");
const LocalStrategy = require("passport-local");
//Facebook
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/User");
const keys = require("./keys");

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

//PASSPORT GOOGLE
passport.use(
    new GoogleStrategy({
        // options for the google strategy
        callbackURL: "/auth/google/redirect",
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, function(accessToken, refreshToken, profile, done) {
        // accessToken: what we receive from Google
        // refreshToken: refreshes the access token
        // profile: information that passport comes back with
        // done: call when we are done with the callback function
        User.findOne({googleID: profile.id}).then((foundUser) => {
            if(foundUser) {
                done(null, foundUser);
            } else {
                console.log(profile);
                new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleID: profile.id
                }).save().then((newUser) => {
                    console.log("new User Created: " + newUser);
                    done(null, newUser);
                });
            }
        })
        // DBmySQL.query(commands.query.searchGoogle, profile.id, (err, rows) => {
        //     if(err) {
        //         return done(err);
        //     }
        //     if(rows.length) {
        //         return done(null, rows[0]);
        //     } else {
        //         var userData = {
        //             username: profile.displayName,
        //             email: profile.emails[0].value,
        //             googleID: profile.id
        //         };
        //         DBmySQL.query(commands.query.insertUser, userData, (err, newUser) => {
        //             if(err) throw err;
        //             // console.log(newUser.insertId);
        //             userData.id = newUser.insertId;
        //             return done(null, userData);
        //         });
        //     }
        // });
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
    clientID: keys.facebookClientInfo.cId,
    clientSecret: keys.facebookClientInfo.cPw,
    callbackURL : keys.facebookClientInfo.callback,
    profileFields: ['id', 'email', 'name']
    //passReqToCallback: true
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookID: profile.id}).then((foundUser) => {
        if(foundUser) {
            done(null, foundUser);
        } else {
            console.log(profile);
            new User({
                name: profile.name.givenName + " " + profile.name.familyName,
                email: profile.emails[0].value,
                facebookID: profile.id
            }).save().then((newUser) => {
                console.log("new User Created: " + newUser);
                done(null, newUser);
            });
        }
    })
  }
));

module.exports = passport;
