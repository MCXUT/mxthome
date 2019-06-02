const express = require("express");
const router = express.Router()
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const async = require("async");
const keys = require("../config/keys");

const Verification = require("./createToken");
const User = require("../models/User");

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
                        User.createUser(user, (err, createdUser) => {
                            if(err) throw err;
                            Verification.createToken(req, res, createdUser);
                        });

                    }
                });
            });
        }
    })
});

module.exports = router;
