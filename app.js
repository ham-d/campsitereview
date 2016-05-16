var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds"),
    passport   = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local");

//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    

//seedDB(); //clearingDB and making fake default data
//connect mongo and DB to node app
//set DATABASEURL in console with export DATABASEURL=mongod://...
mongoose.connect(process.env.DATABASEURL);


//using bodyParser to make data readable/static to connect public folder
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//flash requires a session of any sort(we are using express-session)
app.use(flash());
//making so ejs extension is not always required
app.set("view engine", "ejs");

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: process.env.SECRETVAR,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//using middleware strored in passport(locals). 
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//using routes 
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//starting the server
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started"); 
});

