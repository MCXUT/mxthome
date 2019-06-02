const nodemailer = require("nodemailer");
const crypto = require("crypto");
const async = require("async");
const keys = require("../config/keys");

const User = require("../models/User");


module.exports.createToken = (req,user) => {
  //Add codes for email verified.
  console.log(user);
  var userEmail = user.email;
  async.waterfall([
    (done) => {
      crypto.randomBytes(20, (err, buf) => {
          var token = buf.toString('hex');
          done(err, token);
      });
    },
    (token, done) => {
      user.emailVerificationToken = token;
      user.emailVerificationExpires = Date.now() + 36000;
      console.log(user);
      user.save((err) => {
          done(err, token, user);
      })
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
          to : user.email,
          subject : "MXT : Email Verification",
          text : "Please Verify Your Email Address by clicking the link below :)",
          html: '<p>Verifying your email address</p>' +
                '<h3>Click the link below to verify your email</h3>' +
                '<a href="http://' + req.headers.host + '/auth/verification/emailAddress/' + token + '">verify your email</a>'
        };
        transporter.sendMail(mailOption, (err) => {
            if(err) {
                req.flash("error_reset", "Error Occured when sending the email");
                return res.redirect("/");
            }
            res.redirect("/");
        });
    }
  ])
}
