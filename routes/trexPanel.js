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
          var client = new MongoClient(uri, {
            useNewUrlParser: true
          });

          client.connect(err => {
            var db = client.db("test");
            db.collection("partners", function(err, partnerColl) {
              partnerColl.find().toArray(function(err, partners) {
                console.log(partners[1]);
                var client2 = new MongoClient(uri, {
                  useNewUrlParser: true
                });
                client2.connect(err => {
                  var db2 = client2.db("test");
                  db2.collection("clients", function(err, clientColl) {
                    clientColl.find().toArray(function(err, clients) {
                      return res.render("trexAdminpage", {
                        partnerList: partners,
                        clientList: clients
                      });
                    });
                  });
                  client2.close();
                });

              });
            });
            client.close();
          });
        }
    });
  }
});

module.exports = router;
