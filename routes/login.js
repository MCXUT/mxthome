const express = require("express");
const router = express.Router()

const keys = require("../config/keys");
const passport = require("../config/passport_config");

router.get('/crew/mxt/we/are/the/champions/hire/us/plz/trhuer9ghrst9uhw459unfuhwtuhpsFGHRSwfdfghstrh3', (req,res) => {
  res.render("crewLogin");
})

router.post('/crew/mxt/we/are/the/champions/hire/us/plz/trhuer9ghrst9uhw459unfuhwtuhpsFGHRSwfdfghstrh3', passport.authenticate('crew-login', {
    successRedirect: "/",
    failureRedirect: "back",
    failureFlash: true,
    successFlash: "Successfully logged in"
}), (req, res) => {

});

router.post('/login', passport.authenticate('client-login', {
    successRedirect: "back",
    failureRedirect: "back",
    failureFlash: true,
    successFlash: "Successfully logged in"
}), (req, res) => {

});

router.get("/logout", function(req,res) {
  req.logout();
  res.redirect("back");
});

module.exports = router;
