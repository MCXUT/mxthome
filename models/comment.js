const mongoose = require("mongoose"),
      mongodb = require("mongodb");

var commentSchema = mongoose.Schema({
  contents: String,
  author: String,
  authorEmail: String,
  comment_date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model("comment", commentSchema);
