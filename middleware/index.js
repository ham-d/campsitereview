var Campground = require("../models/campground");
var Comment = require("../models/comment");

//all the middleware goes here
var middlewareObj = {};

//middleware to check if correct user is logged in for campground
middlewareObj.checkCampgroundOwner = function(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err) {
               req.flash("error", "Campground not found");
               res.redirect("back");
           } else {
               //if user owns the campground, allow edit:
               // .equals is a mongoose method to to check id
               if(foundCampground.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You need to be logged in to do that");
                   res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "You don't have permission to do that");
        res.redirect("back");
    }
}

//middleware to check if correct user is logged in for comments
middlewareObj.checkCommentOwner = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err) {
               req.flash("error", "Sorry, something went wrong");
               res.redirect("back");
           } else {
               //if user owns the campground, allow edit:
               // .equals is a mongoose method to to check id
               if(foundComment.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that");
                   res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

//middleware to check if user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //flash(first param(key), second param(value))
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;