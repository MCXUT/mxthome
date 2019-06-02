const express = require("express");
const router = express.Router()

const keys = require("../config/keys");
const passport = require("../config/passport_config");

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

router.get("/logout", function(req,res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
