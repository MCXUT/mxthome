const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const ejs = require("ejs");

const passport = require("./config/passport_config");
const keys = require("./config/keys");
const app = express();

const userRoutes = require("./routes/users");

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
app.use('/static', express.static(path.join(__dirname, 'public')));

// Home route
app.get("/", (req, res) => {
    res.render("mxtwebsite.html");
});

app.use("/auth", userRoutes);

// Set port and listen to it
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log("Server started on port " + app.get('port'));
});
