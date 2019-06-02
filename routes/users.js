const express = require("express");
const router = express.Router()
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const passport = require("../config/passport_config");
const User = require("../models/User");

// router.get("/register", (req, res) => {
//     res.render("register");
// });

router.post("/register", (req, res) => {
    var newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        dateOfBirth: req.body.dateofbirth,
        company: req.body.company,
        city: req.body.city,
        country: req.body.country
    };

    if(!(req.body.name && req.body.email && req.body.password && req.body.password2)) {
        req.flash("error_signup", "Some information is missing");
        return res.redirect("/");
    }
    // req.body.password2 = "gggggggg";
    // if(!(req.body.name && req.body.email && req.body.password)) {
    //     return res.json({error: "Some information missing"});
    // }

    User.getUserByUsername(newUser.email, (err, user) => {
        if(err) throw err;
        if(user) {
            req.flash("error_signup", "Username is already taken");
            return res.redirect("/");
        } else {
            bcrypt.hash(req.body.password2, 10, (err, hash) => {
                if(err) throw err;
                User.comparePassword(newUser.password, hash, (err, isMatch) => {
                    if(err) throw err;
                    if(!isMatch) {
                        req.flash("error_signup", "Passwords do not match");
                        return res.redirect("/");
                    } else {
                        var user = new User({
                            name: newUser.name,
                            email: newUser.email,
                            password: newUser.password,
                            gender: newUser.gender
                        });
                        User.createUser(user, (err, user) => {
                            if(err) throw err;
                            console.log(user);
                        });
                        req.flash("success", "Signup Completed");
                        return res.redirect("/");
                    }
                });
            });
        }
    })
});

// router.get("/login", (req, res) => {
//     res.send("Under Construction...");
// });

router.post('/login', passport.authenticate('local-login', {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: "Invalid username or password",
    successFlash: "Successfully logged in"
}), (req, res) => {

});

router.get("/google", passport.authenticate('google', {
    scope: ['email', 'profile']
}));

router.get("/google/redirect", passport.authenticate('google'), (req, res) => {
    res.redirect("/");
});

// --> FacebookStrategy
router.get("/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));

router.get("/facebook/callback", passport.authenticate("facebook"), (req,res) => {
  res.redirect("/");
});
// --> FacebookStrategy

router.get("/logout", function(req,res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
