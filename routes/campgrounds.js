var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

//INDEX(rest) route - show all campgrounds
router.get("/", function(req, res){
    
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
           //1st campgrounds is the name for .ejs file, 2nd campgrounds is data we're passing in
           res.render("campgrounds/index.ejs", {campgrounds: allCampgrounds});
        }
    });
});

//CREATE(rest) route - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampGround = {name: name, image: image, description: desc, author: author};
    //create a new campground and save to DB
    Campground.create(newCampGround, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW(rest) route - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
});

//SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        } else {
            //render show template with that campground
            res.render("campgrounds/show.ejs", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE 
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE CAMPGROUND ROUTE 
router.put("/:id", middleware.checkCampgroundOwner, function(req, res){
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            //redirect somewhere(show page)
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;