module.exports = function(app) {
  const nodemailer = require("nodemailer");
  const emailKeys = require("../config/keys");

  app.get("/feedback", function(req, res){
    res.render("page_feedback.html");
  });

  // Redirected route once feedback email has been successfully sent
  app.get("/feedback_thanks", function(req, res) {
    res.render("feedback_thanks.html");
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
      subject : "MXT.com feedback",
      text : "Feedback from "+ req.body.name + " : " + req.body.email + "\n\n" + req.body.message
    };

    transporter.sendMail(mailOption, function(err, info){
      if(err) {
        console.error("Send Mail Error : ", err);
      }
      else {
        console.log("Message sent : ", info);
        res.redirect("/feedback_thanks");
      }
    });

  });

}
