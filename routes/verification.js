const express = require("express");
const router = express.Router()

const keys = require("../config/keys");
const User = require("../models/User");


router.get('/verification/emailAddress/:token', (req, res) => {
    User.findOne({
        emailVerificationToken: req.params.token,
        emailVerificationExpires: {$gt: Date.now()},
    }).then((foundUser) => {
        if(!foundUser) {
            req.flash("error_reset", "Your Token has been expired");
            return res.redirect("/");
        }
        // foundUser.isVerified = true;
        // foundUser.save(function(err) {
        //   if(err) {return res.send({msg: err.message});}
        //   return res.redirect("/");
        // });
        var update = {$set: {
          isVerified: true,
          emailVerificationToken: undefined,
          emailVerificationExpires: undefined
        }};
        User.findByIdAndUpdate(foundUser._id, update, (err)=> {
          if(err) {
              req.flash("error_reset", "Unknown Error Occurred");
              return res.redirect("/");
          }
        });
        req.login(foundUser,function(err) {
          if(!err){return res.redirect("/");}
        })
        // return res.redirect("/");
    });
});

router.get("/verification/resend", (req, res) => {
  //NOT COMPLETED
  res.redirect("/");
});


module.exports = router;
