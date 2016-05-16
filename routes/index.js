// register/login routes
var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("landing.ejs");
});

/* ===========
   AUTH ROUTES
   =========== */
   
//show register form
router.get("/register", function(req, res) {
    res.render("register");
});
//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    //.register is a mongoose method
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //err.message is a passport.mongoose method
            // req.flash("error", err.message);
            // //returning to prevent continuing down call stack
            // return res.render("register");
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            //user is from line 23(User.register...(err, user)
            req.flash("success", "Welcome to YelpCamp " + user.username.replace(/\b[a-z]/g,function(f){return f.toUpperCase();}));
            res.redirect("/campgrounds");
        });
    });
});

//show login form 
router.get("/login", function(req, res) {
    res.render("login");
});
//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login",
        failureFlash: "Invalid username or password",
        successFlash: "Welcome to YelpCamp!"
    }), function(req, res) {
});

//logout route
router.get("/logout", function(req, res) {
    //logout is a passport method
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;