const express = require("express");
const router = express.Router()
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const passport = require("../config/passport_config");
const User = require("../models/User");

router.get("/register", (req, res) => {
    res.send("Under Construction...");
});

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
        return res.json({error: "Some information missing"});
    }

    User.getUserByUsername(newUser.email, (err, user) => {
        if(err) throw err;
        if(user) {
            return res.json({error: "Username already taken"});
        } else {
            bcrypt.hash(req.body.password2, 10, (err, hash) => {
                if(err) throw err;
                User.comparePassword(newUser.password, hash, (err, isMatch) => {
                    if(err) throw err;
                    if(!isMatch) {
                        return res.json({error: "Passwords do not match"});
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
                        res.redirect("/");
                    }
                });
            });
        }
    })
});

router.get("/login", (req, res) => {
    res.send("Under Construction...");
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: "Invalid username or password"
}), (req, res) => {

});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});


module.exports = router;
