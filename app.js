var express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),
  app = express(),
  methodOverride = require("method-override"),
  seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
  compgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

//seedDB();
//mongoose.connect("mongodb://localhost:27017/win",{useNewUrlParser: true});

//rparaman:<password>@cluster0-zugga.mongodb.net/test?retryWrites=true&w=majority
mongoose
  .connect(
    "mongodb+srv://rparaman:Geek123@cluster0-zugga.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch(err => {
    console.log("ERROR:", err.message);
  });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));

// passport config
app.use(
  require("express-session")({
    secret: "Nivi is the best and cutest girl in this world! ",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Auth Routes

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
// routes
app.use("/", indexRoutes);
app.use("/campgrounds", compgroundRoutes);

app.use(commentRoutes);

// COMMENT routes
var port = process.env.PORT || 3000;
app.listen(port || process.env.PORT, process.env.IP, function() {
  console.log("App server is running!" + port);
});
