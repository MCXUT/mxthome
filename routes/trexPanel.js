const express = require("express");
const router = express.Router()
// const MongoClient_trex = require("mongodb").MongoClient;

const keys = require("../config/keys");


router.get("/trex", (req, res) => {
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
              res.render("trexAdminpage", {
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
  })

});

module.exports = router;
