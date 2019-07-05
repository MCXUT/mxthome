const express = require("express");
const router = express.Router()
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Client = require("../models/client");

router.get("/register_client", (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  } else {
    User.findById(req.user._id, function(err, foundUser) {
      if (err) {
        console.log(err);
        return res.redirect("/");
      }
      if (foundUser) {
        return res.render("registerClient");
      } else {
        return res.redirect("/");
      }
    });
  }
});

router.post("/register_client", (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  } else {
    User.findById(req.user._id, function(err, foundUser) {
      if (err) {
        console.log(err);
        return res.redirect("/");
      }
      // Only for MXT admins
      if (foundUser) {
        var newClient = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            companyName: req.body.companyName
        };
        if(!(req.body.name && req.body.email && req.body.password && req.body.password2)) {
            req.flash("error_signup", "Some information is missing");
            return res.redirect("/");
        }

        Client.getClientByEmail(newClient.email, (err, user) => {
            if(err) throw err;
            if(user) {
                req.flash("error_signup", "Email is already taken");
                return res.redirect("/");
            } else {
                bcrypt.hash(req.body.password2, 10, (err, hash) => {
                    if(err) throw err;
                    Client.comparePassword(newClient.password, hash, (err, isMatch) => {
                        if(err) throw err;
                        if(!isMatch) {
                            req.flash("error_signup", "Passwords do not match");
                            return res.redirect("/");
                        } else {

                            var client = new Client({
                                email: newClient.email,
                                password: newClient.password,
                                name: newClient.name,
                                companyName: newClient.companyName,
                                adminPanel: "/services/" + newClient.companyName
                            });

                            Client.createClient(client, (err, createdClient) => {
                                if(err) throw err;
                                res.redirect("/");
                            });

                        }
                    });
                });
            }
        })
      } else {
        return res.redirect("/");
      }
    });
  }
});

// 클라이언트가 회사 어드민 추가할 때 쓰이는 곳
router.post("/addAdmin", (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  } else {
    if (!(req.user.companyName === req.body.companyName)) {
      return res.redirect("/");
    }
    else {
      Client.findById(req.user._id, function(err, foundUser) {
        if (err) {
          console.log(err);
          return res.redirect("/");
        }
        // Only for MXT admins
        if (foundUser) {
          var newClient = {
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              companyName: req.body.companyName
          };
          if(!(req.body.name && req.body.email && req.body.password && req.body.password2)) {
              req.flash("error_signup", "Some information is missing");
              return res.redirect("/");
          }

          Client.getClientByEmail(newClient.email, (err, user) => {
              if(err) throw err;
              if(user) {
                  req.flash("error_signup", "Email is already taken");
                  return res.redirect("/");
              } else {
                  bcrypt.hash(req.body.password2, 10, (err, hash) => {
                      if(err) throw err;
                      Client.comparePassword(newClient.password, hash, (err, isMatch) => {
                          if(err) throw err;
                          if(!isMatch) {
                              req.flash("error_signup", "Passwords do not match");
                              return res.redirect("/");
                          } else {

                              var client = new Client({
                                  email: newClient.email,
                                  password: newClient.password,
                                  name: newClient.name,
                                  companyName: newClient.companyName,
                                  adminPanel: "/services/" + newClient.companyName
                              });

                              Client.createClient(client, (err, createdClient) => {
                                  if(err) throw err;
                                  res.redirect(req.user.adminPanel);
                              });

                          }
                      });
                  });
              }
          })
        } else {
          return res.redirect("/");
        }
      });
    }
  }
});

module.exports = router;
