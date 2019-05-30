module.exports = function(app) {
  const nodemailer = require("nodemailer");
  const emailKeys = require("../config/keys");

  app.get("/feedback", function(req, res){
    res.render("page_feedback");
  });

  // Redirected route once feedback email has been successfully sent
  app.get("/feedback_thanks", function(req, res) {
    res.render("feedback_thanks");
  });

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailKeys.emailInfo.user,
      pass: emailKeys.emailInfo.pass
    }
  });
  app.post("/feedback", function(req, res) {
    if(req.user)
    {
      var mailOption = {
        from : req.user.email,
        to : emailKeys.emailInfo.user,
        subject : "MXT.com feedback",
        text : "Feedback from "+ req.user.name + " : " + req.user.email + "\n\n" + req.body.message
      };

      transporter.sendMail(mailOption, function(err, info){
        if(err) {
          req.flash("error", "Unexpected Error Happened");
          res.redirect("/");
        }
        else {
          req.flash("success", "Feedback Successfully Sent");
          res.redirect("/feedback");
        }
      });
    }
    else
    {
      req.flash("error", "Not Logged In");
      res.redirect("/");
    }

  });

}
