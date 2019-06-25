const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var ClientSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    companyName: {
        type: String
    },
    adminPanel: {
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

var Client = module.exports = mongoose.model('Client', ClientSchema);

module.exports.findAdmin = (companyName, done) => {
  var query = {companyName: companyName};
  Client.find(query, done);
};

module.exports.createClient = (newClient, done) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newClient.password, salt, (err, hash) => {
            newClient.password = hash;
            newClient.save(done);
        });
    });
};

module.exports.getClientByEmail = (username, done) => {
    var query = {email: username};
    Client.findOne(query, done);
};

module.exports.comparePassword = (candidatePassword, hash, done) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        done(null, isMatch);
    });
};
