const express = require("express");
const router = express.Router()
// const MongoClient_trex = require("mongodb").MongoClient;

const keys = require("../config/keys");
const client = require("../models/client");

router.get("/trex", (req, res) => {
  if(!req.user) {
    return res.redirect("/");
  }
  else {
      client.findById(req.user._id, function(err, foundClient){
        if(err) {
          console.log(err);
          return res.redirect("/");
        }
        if(!foundClient) {
          return res.redirect("/");
        }
        else {
          var MongoClient = require('mongodb').MongoClient;
          const uri = "mongodb+srv://mxt:" + keys.mongodb.pass + "@cluster0-jdwe1.mongodb.net/test?retryWrites=true&w=majority";
          var mClient = new MongoClient(uri, {
            useNewUrlParser: true
          });

          mClient.connect(err => {
            var db = mClient.db("test");
            db.collection("partners", function(err, partnerColl) {
              partnerColl.find().toArray(function(err, partners) {
                var mClient2 = new MongoClient(uri, {
                  useNewUrlParser: true
                });
                mClient2.connect(err => {
                  var db2 = mClient2.db("test");
                  db2.collection("clients", function(err, clientColl) {
                    clientColl.find().toArray(function(err, clients) {
                      var query = { companyName: "Trex" };
                      client.findAdmin("Trex", function(err, admins){
                        console.log("Partner List: " + partners);
                        console.log("Client List: " + clients);
                        console.log("Admin List: " + admins);
                        return res.render("trexAdminpage", {
                          partnerList: partners,
                          clientList: clients,
                          adminList: admins
                        });
                      })
                    });
                  });
                  mClient2.close();
                });

              });
            });
            mClient.close();
          });
        }
    });
  }
});

module.exports = router;
