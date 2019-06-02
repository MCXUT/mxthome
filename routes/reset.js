const express = require("express");
const router = express.Router()
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const async = require("async");

const keys = require("../config/keys");
const passport = require("../config/passport_config");
const User = require("../models/User");
const middleware = require("../middlewares/middleware");


router.post("/reset", middleware.matchUserEmail, (req, res) => {
    var userEmail = req.body.email;

    async.waterfall([
        (done) => {
            crypto.randomBytes(20, (err, buf) => {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        (token, done) => {
            User.findOne({email: userEmail}).then((foundUser) => {
                if(!foundUser) {
                    req.flash("error_reset", "No account with that email address exists.");
                    return res.redirect('/');
                }
                foundUser.resetPasswordToken = token;
                foundUser.resetPasswordExpires = Date.now() + 3600000;
                console.log(foundUser);
                foundUser.save((err) => {
                    done(err, token, foundUser);
                })
            });
        },
        (token, foundUser, done) => {
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: keys.emailInfo.user,
                    pass: keys.emailInfo.pass,
                },
                tls: {
                    ciphers: "SSLv3"
                }
            });
            const mailOption = {
              from : keys.emailInfo.user,
              to : foundUser.email,
              subject : "Password Reset Request",
              text : "Reset Your Password From the Link Below",
              html: '<p>Password Reset Form</p>' +
                    '<h3>Click the link below to reset your password</h3>' +
                    '<a href="http://' + req.headers.host + '/auth/reset/password/' + token + '">reset your password</a>'
            };
            transporter.sendMail(mailOption, (err) => {
                if(err) {
                    req.flash("error_reset", "Error Occured when sending the email");
                    return res.redirect("/");
                }
                res.redirect("/");
            });
        }
    ], (err) => {
        if(err) next(err);
        res.redirect("/");
    });
});

router.get('/reset/password/:token', (req, res) => {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()},
    }).then((foundUser) => {
        if(!foundUser) {
            req.flash("error_reset", "Password Reset Token has been expired");
            return res.redirect("/");
        }
        res.render("page_reset", {token: req.params.token});
    });
});

router.post("/reset/password/:token", (req, res) => {
    const passwordR = req.body.password;
    const passwordCR = req.body.password2;

    async.waterfall([
        (done) => {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {$gt: Date.now()},
            }).then((foundUser) => {
                if(!foundUser) {
                    req.flash("error_reset", "Password Reset Token is invalid or has expired");
                    return res.redirect("/");
                }
                if(passwordR === passwordCR) {
                    console.log(foundUser);
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(passwordR, salt, (err, hash) => {
                            var passwordRefresh = {$set: {
                                password: hash,
                                resetPasswordToken: undefined,
                                resetPasswordExpires: undefined
                            }};
                            User.findByIdAndUpdate(foundUser._id, passwordRefresh, (err) => {
                                if(err) {
                                    req.flash("error_reset", "Unknown Error Occurred");
                                    return res.redirect("/");
                                }
                            });
                            return res.redirect("/");
                        });
                    });
                } else {
                    req.flash("error_reset", "Passwords do not match");
                    return res.redirect("back");
                }
            });
        }
    ])
});



module.exports = router;
