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
            req.flash("error_reset", "Password Reset Token has expired");
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
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(passwordR, salt, (err, hash) => {
                            foundUser.resetPasswordToken = undefined;
                            foundUser.resetPasswordExpires = undefined;
                            var passwordRefresh = {$set: {password: hash}};
                            User.findByIdAndUpdate(foundUser._id, passwordRefresh, (err) => {
                                if(err) {
                                    req.flash("error_reset", "Unknown Error Occurred");
                                    return res.redirect("/");
                                }
                            });
                            // res.redirect("/");
                            res.json({success: "Password Successfully Changed"});
                        });
                    });
                }
            });
        }
    ])
});

router.get("/logout", function(req,res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
