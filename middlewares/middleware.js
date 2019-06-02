const User = require("../models/User");

var middleware = {};

middleware.matchUserEmail = (req, res, next) => {
    User.findOne({email: req.body.email}).then((foundUser) => {
        if(!foundUser) {
            // req.flash("error_reset", "No user exists with such email");
            // return res.redirect("/");
            return res.json({error: "No user exists with such email"});
        } else {
            return next();
        }
    });
}

module.exports = middleware;
