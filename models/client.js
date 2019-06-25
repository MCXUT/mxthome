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
    companyName: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

var Client = module.exports = mongoose.model('Client', ClientSchema);

module.exports.createClient = (newClient, done) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newClient.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(done);
        });
    });
};

module.exports.getUserByUsername = (username, done) => {
    var query = {email: username};
    Client.findOne(query, done);
};

module.exports.comparePassword = (candidatePassword, hash, done) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        done(null, isMatch);
    });
};
