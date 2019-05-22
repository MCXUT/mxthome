module.exports = function(app) {
  const nodemailer = require("nodemailer");
  const emailKeys = require("../config/keys");

  app.get("/feedback", function(req, res){
    res.render("page_feedback.html");
  });

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailKeys.emailInfo.user,
      pass: emailKeys.emailInfo.pass
    }
  });
  app.post("/feedback", function(req, res) {
    var mailOption = {
      from : req.body.email,
      to : emailKeys.emailInfo.user,
      subject : req.body.name,
      text : req.body.message
    };

    transporter.sendMail(mailOption, function(err, info){
      if(err) {
        res.render("page_feedback.html", {err: err});
      }
      else {
        res.render("page_feedback.html", {err: false});
      }

    });

  });

}
