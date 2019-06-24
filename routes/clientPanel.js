const express = require("express");
const router = express.Router()
// const MongoClient_trex = require("mongodb").MongoClient;

const keys = require("../config/keys");


router.get("/trex", (req,res) => {
  var MongoClient = require('mongodb').MongoClient;
  const uri = "mongodb+srv://mxt:"+keys.mongodb.pass+"@cluster0-jdwe1.mongodb.net/test?retryWrites=true&w=majority";
  var client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    var db = client.db("test");
    db.collection("partners", function(err, partnerColl){
      partnerColl.find().toArray(function(err, partners) {
        console.log(partners[1]);
        var client2 = new MongoClient(uri, { useNewUrlParser: true });
        client2.connect(err => {
          var db2 = client2.db("test");
          db2.collection("clients", function(err, clientColl){
            clientColl.find().toArray(function(err, clients){
              console.log(clients);
              res.render("trexAdminpage", { partnerList: partners, clientList: clients });
            });
          });
          client2.close();
        });
        // db.collection("clients", function(err, clientColl){
        //   console.log("Part I : Client");
        //   clientColl.find({ }).toArray(function(err, clients){
        //     console.log(clients);
        //     res.render("trexAdminpage", { partnerList: partners, clientList: clients });
        //   });
        // });
      });
    });
    client.close();
  })
    // const MongoClient = require('mongodb').MongoClient;
    // const uri = "mongodb+srv://mxt:"+keys.mongodb.pass+"@cluster0-jdwe1.mongodb.net/test?retryWrites=true&w=majority";
    // const client = new MongoClient(uri, { useNewUrlParser: true });
    //
    // var trex_partnerList = [];
    // var trex_clientList = [];
    //
    // client.connect(err => {
    //   const partnerColl = client.db("test").collection("partners");
    //   const clientColl = client.db("test").collection("clients");
    //
    //   partnerColl.find({ }).toArray(function(err, partners) {
    //
    //     if(err) {console.log(err);}
    //     else {
    //       for(var i = 0; i < partners.length; i++) {
    //         trex_partnerList[i] = partners[i];
    //       }
    //       console.log(trex_partnerList[0]);
    //       clientColl.find({ }).toArray(function(err, clients) {
    //         if(err) {console.log(err);}
    //         else {
    //           for(var i = 0; i < clients.length; i++) {
    //             trex_clientList[i] = clients[i];
    //           }
    //         }
    //       });
    //       res.render("trexAdminpage", { partnerList: trex_partnerList, clientList: trex_clientList });
    //     }
    //   });
    //
    //   client.close();
    //
    // });
});

module.exports = router;
