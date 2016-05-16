var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var data = [
    {
        name: "Lake camp",
        image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?crop=entropy&fit=crop&fm=jpg&h=875&ixjsv=2.1.0&ixlib=rb-0.3.5&q=80&w=1575",
        description: "hi hi hi"
    },
    {
        name: "snow mountain",
        image: "https://images.unsplash.com/photo-1432817495152-77aa949fb1e2?crop=entropy&fit=crop&fm=jpg&h=875&ixjsv=2.1.0&ixlib=rb-0.3.5&q=80&w=1575",
        description: "blah blah blah"
    },
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1427464407917-c817c9a0a6f6?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=d7e06a629c813230858c047e2b6b0806",
        description: "1 2 3"
    }
    
];

function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds");
         //add a few campgrounds
        //(added in callback of remove for synchronization issues)
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Added comment");
                            }
                        });
                }
            });
        });
    });
}

module.exports = seedDB;