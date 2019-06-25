const express = require("express");
const router = express.Router()

const User = require("../models/User");

router.get("/register_client", (req,res) => {
  if(!req.user) {
    return res.redirect("/");
  }
  else {
    User.findById(req.user._id, function(err, foundUser) {
      if(err) {
        console.log(err);
        return res.redirect("/");
      }
      if(foundUser) {
        return res.render("registerClient");
      }
      else {
        return res.redirect("/");
      }
    });
  }
});

router.post("/register_client", (req, res) => {
  if(!req.user) {
    return res.redirect("/");
  }
  else {
    User.findById(req.user._id, function(err, foundUser) {
      if(err) {
        console.log(err);
        return res.redirect("/");
      }
      if(foundUser) {
        
        return res.redirect("/");
      }
      else {
        return res.redirect("/");
      }
    });
  }
});

module.exports = router;
