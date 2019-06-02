const express = require("express"),
      bodyParser = require("body-parser"),
      path = require("path"),
      crypto = require("crypto"),
      mongoose = require("mongoose"),
      multer = require("multer"),
      GridFsStorage = require("multer-gridfs-storage"),
      Grid = require("gridfs-stream"),
      methodOverride = require("method-override"),
      mongodb = require("mongodb"),
      Board = require("../models/board"),
      Comment = require("../models/comment");
const router = express.Router();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');

const keys = require("../config/keys");

// Create mongo connection
mongoose.connect("mongodb+srv://" + keys.mongodb.user + ":" + keys.mongodb.pass + "@cluster0-gdoa3.mongodb.net/test?retryWrites=true", {useNewUrlParser: true});
const db = mongoose.connection;


// Init grid fs stream
let gfs;

db.once("open", () => {
  // Initialize stream
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Create storage engine
const storage = new GridFsStorage({
  url: "mongodb+srv://" + keys.mongodb.user + ":" + keys.mongodb.pass + "@cluster0-gdoa3.mongodb.net/test?retryWrites=true",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });


/////////////////// ROUTES /////////////////////

// @route GET /
// @desc Loads form
router.get("/announcement", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length ==0) {
      // if there are no files saved
      db.collection("boards").count(function(err, count) {
        if(count == 0) {
          // no files and no announcements
            res.render("announcement", { req: req, files: false, announcements: false });
        } else {
          // no files but some announcements
            var announcements = [];
            Board.find({}, function(err, allBoards) {
              for ( let i = 0; i < allBoards.length; i++ ) {
                announcements.push(allBoards[i]);
                // push an array of all the announcements
              }
              res.render("announcement", { req: req, files: false , announcements: announcements });
            });
        }
      });
    } else {
      // if there are both files and announcements stored to display
      files.map(file => {
        if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });

      var announcements = [];
      Board.find({}, function(err, allBoards) {
        for ( let i = 0; i < allBoards.length; i++ ) {
          announcements.push(allBoards[i]);
        }
        res.render("announcement", { req: req, files: files , announcements: announcements });
      });
    }
  });
});



// ONLY ADMINS WILL BE ABLE TO ACCESS THIS PAGE
// @route GET /announcement_upload
// @desc Load upload form
router.get("/announcement_upload", (req, res) => {
  if (req.user) {
    if (req.user.isAdmin) {
      // Only let admins upload announcements
      res.render("announcement_upload");
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
});


// ONLY ADMINS CAN UPLOAD ANNOUNCEMENTS
// @route POST /upload
// @desc Uploads announcement(+ file) to DB
router.post("/upload", upload.single("file"), (req, res) => {
  //res.json({file: req.file});
  if (req.file) {
    // if a file was posted with the anouncement
    var board = new Board({
      title : req.body.title,
      contents : req.body.contents,
      imageID : req.file.filename
    });
    board.save(function(err) {
      if (err) {
        console.log(err);
        res.redirect("/services/announcement");
      }
      res.redirect("/services/announcement");
    });
  } else {
    // if no file was posted, just the announcement
    var board = new Board({
      title : req.body.title,
      contents : req.body.contents
    });
    board.save(function(err) {
      if (err) {
        console.log(err);
        res.redirect("/services/announcement");
      }
      res.redirect("/services/announcement");
    });
  }
});


// @route GET /files
// @desc Display all files in JSON
router.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length ==0) {
      // no files exist
      return res.status(404).json({
        err: "No files exist"
      });
    }

    // Files exist
    return res.json(files);
  });
});


// @route GET /files/:filename
// @desc Display the file object in JSON
router.get("/files/:filename", (req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    // Check if file
    if (!file || file.length ==0) {
      return res.status(404).json({
        err: "No file exists"
      });
    }
    // File exists
    return res.json(file);
  });
});


// @route GET /image/:filename
// @desc Display image
router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    // Check if file
    if (!file || file.length ==0) {
      return res.status(404).json({
        err: "No file exists"
      });
    }

    // Check if image
    if(file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image"
      });
    }
  });
});


// ONLY ADMINS CAN DELETE ANNOUNCEMENTS
// @route DELETE /files/:id/:filename
// @desc Delete both the file and the corresponding announcements
router.delete("/files/:id/:filename", (req, res) => {
  db.collection("boards").deleteOne({imageID: req.params.filename});
  gfs.remove({_id: req.params.id, root: "uploads"}, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.redirect("/services/announcement");
  });
});


// @route DELETE /announcements/:id
// @desc Delete announcement only (when no file has been posted with it)
router.delete("/announcements/:id", (req, res) => {
  db.collection("boards").deleteOne({_id: new mongodb.ObjectID(req.params.id)});
  res.redirect("/services/announcement");
});


// @route GET /board/:id
// @desc Load page for specific announcement
router.get("/board/:id", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length ==0) {
      // if there are no files saved
      // increment view count by one and render
      Board.findOneAndUpdate({ _id: req.params.id }, { $inc: { "views" : 1 } }, function(err, board) {
        res.render("board", { req: req, files: false , board: board });
      });
    } else {
      // if there are both files and announcements stored to display
      files.map(file => {
        if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });

      Board.findOneAndUpdate({ _id: req.params.id }, { $inc: { "views" : 1 } }, function(err, board) {
        res.render("board", { req: req, files: files , board: board });
      });
    }

  });
});


// ONLY LOGGED IN USER CAN WRITE A COMMENT
// @route POST /comment/write
// @desc Insert comment into the specific announcement
router.post("/comment/write/:id", (req, res) => {
  var comment = new Comment();
  comment.author = req.body.author;
  comment.authorEmail = req.body.authorEmail;
  comment.contents = req.body.contents;

  Board.findOneAndUpdate({_id : req.params.id}, { $push: { comments : comment } }, function (err, board) {
    if (err) {
      console.log(err);
      res.redirect("/");
    };
    res.redirect("/services/board/" + req.params.id);
  });
});


// A USER CAN ONLY DELETE THEIR OWN COMMENT (match the username?)
// @route DELETE /comment/:aid/:cid
// @desc Delete specific comment of the specific announcement
router.delete("/comment/:aid/:cid", (req, res) => {
  Board.findOneAndUpdate({_id : req.params.aid}, { $pull: { comments : {_id : req.params.cid} } }, function (err, board) {
    if (err) {
      console.log(err);
      console.log("Failed to delete comment.");
      res.redirect("/services/board/" + req.params.aid);
    };
    res.redirect("/services/board/" + req.params.aid);
  });
});



router.get("/faq", (req, res) => {
  res.render("faq")
});


module.exports = router;
