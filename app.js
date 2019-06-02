const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const ejs = require("ejs");
const flash = require("connect-flash");

const passport = require("./config/passport_config");
const keys = require("./config/keys");
const app = express();

const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const resetRoutes = require("./routes/reset");

// Connect to database
mongoose.connect("mongodb+srv://" + keys.mongodb.user + ":" + keys.mongodb.pass + "@cluster0-gdoa3.mongodb.net/test?retryWrites=true", {useNewUrlParser: true});
const db = mongoose.connection;

// set view engine
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.engine("html", ejs.renderFile);

// Set bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// session setting
app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}));

// passport setting
app.use(passport.initialize());
app.use(passport.session());

// Set static directory
app.use("/static", express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.error_signup = req.flash("error_signup");
    res.locals.currentUser = req.user;
    next();
});

var fs = require("fs");
// Home route
app.get("/", (req, res) => {
    res.render("mxtwebsite");
});

app.get("/announcement", (req, res) => {
  res.render("announcement");
});

app.get("/faq", (req, res) => {
  res.render("faq");
});

app.use("/auth", loginRoutes);
app.use("/auth", registerRoutes);
app.use("/auth", resetRoutes);

var feedbackController = require("./routes/feedbackController")(app);
// Set port and listen to it
app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), () => {
    console.log("Server started on port " + app.get('port'));
});
