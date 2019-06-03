const express = require("express");
const router = express.Router()

const keys = require("../config/keys");
const User = require("../models/User");
const tokenmailer = require("./createToken");


router.get('/verification/emailAddress/:token', (req, res) => {
    User.findOne({
        emailVerificationToken: req.params.token,
        emailVerificationExpires: {$gt: Date.now()},
    }).then((foundUser) => {
        if(!foundUser) {
            req.flash("error_verify", "Your Token is invalid or has been expired");
            return res.redirect("/");
        }
        var update = {$set: {
          isVerified: true,
          emailVerificationToken: undefined,
          emailVerificationExpires: undefined
        }};
        User.findByIdAndUpdate(foundUser._id, update, (err)=> {
          if(err) {
              req.flash("error_verify", "Unknown Error Occurred");
              return res.redirect("/");
          }
        });
        req.login(foundUser,function(err) {
          if(!err){return res.redirect("/");}
        })
        // return res.redirect("/");
    });
});


router.post("/verification/resend", (req, res) => {
    User.findOne({email: req.body.email}).then((foundUser) => {
        if(!foundUser) {
            req.flash("error_verify", "No such username exists");
            return res.redirect("/");
        }
        if(!foundUser.emailVerificationToken || !foundUser.emailVerificationExpires) {
            return res.status(500).send("Forbidden Access");
        }
        tokenmailer.createToken(req, res, foundUser);
    });
})


module.exports = router;
