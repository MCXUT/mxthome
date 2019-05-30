module.exports = function(app) {
  const nodemailer = require("nodemailer");
  const emailKeys = require("../config/keys");
  const crypto = require("crypto");

  app.get("/feedback", function(req, res){
    res.render("page_feedback");
  });

  // Redirected route once feedback email has been successfully sent
  // app.get("/feedback_thanks", function(req, res) {
  //     if(!req.user) {
  //         return res.status(500).send("Permission Denied");
  //     }
  //     res.render("feedback_thanks");
  // });

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
          console.error("Send Mail Error : ", err);
        }
        else {
          // console.log("Message sent : ", info);
          // crypto.randomBytes(10, (err, buf) => {
          //     var token = buf.toString('hex');
          //     res.redirect("/feedback_thanks");
          // });
          return res.render("feedback_thanks");
        }
      });
    }
    else
    {
      req.flash("error", "Must be logged in first");
      res.redirect("/feedback");
    }

  });

}
