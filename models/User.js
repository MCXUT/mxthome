const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    gender: {
        // enum: ["M", "F", "undefined"]
        type: String,
        // enum: ["M", "F", "Secret"]
    },
    dateOfBirth: Date,
    company: String,
    city: String,
    country: String,
    googleID: String,
    facebookID: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, done) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(done);
        });
    });
};

module.exports.getUserByUsername = (username, done) => {
    var query = {email: username};
    User.findOne(query, done);
};

module.exports.comparePassword = (candidatePassword, hash, done) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        done(null, isMatch);
    });
};
