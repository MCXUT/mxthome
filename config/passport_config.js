const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("../models/User");
const Client = require("../models/client");
const keys = require("./keys");

// login passport
passport.use(
    "crew-login", new LocalStrategy({
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

passport.use(
    "client-login", new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, (username, password, done) => {
        Client.getClientByEmail(username, (err, user) => {
            if(err) throw err;
            if(!user) {
                return done(null, false, {message: "Invalid Username or Password"});
            }
            Client.comparePassword(password, user.password, (err, isMatch) => {
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
        if(user) {
          done(err, user);
        }
        else {
          Client.findById(id, (err, client) => {
            done(err, client);
          });
        }
    });
    // User.findById(id, (err, user) => {
    //     done(err, user);
    // });
});


module.exports = passport;
