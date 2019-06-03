const mongoose = require("mongoose"),
      mongodb = require("mongodb");

var commentSchema = mongoose.Schema({
  contents: String,
  author: String,
  authorEmail: String,
  comment_date: {type: Date, default: Date.now()}
});

var boardSchema = mongoose.Schema({
  title: String,
  contents: String,
  author: String, // automatically get the username of the logged in admin
  views: { type: Number, default: 0 },
  board_date: { type: Date, default: Date.now() },
  comments: [commentSchema],
  // imageID stores the 'filename' of the file that was posted with the announcement
  imageID: String
});

module.exports = mongoose.model("board", boardSchema);
