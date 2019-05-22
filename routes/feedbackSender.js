module.exports = function(app) {
  var nodemailer = require("nodemailer");
  var emailKeys = require("../config/keys");

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailKeys.emailInfo.user,
      pass: emailKeys.emailInfo.pass
    }
  });
  
}
