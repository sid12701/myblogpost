const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const Post = require('./models/post');
const app = express();
const path = require("path");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/myblogDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/",function(req,res){
    Post.find({},function(err,posts){
        if(!err){
            res.render("home",{
                posts:posts
            });
        }
    })
});

app.get("/about",function(res,req){
    res.render("about");
})

app.get("/contact",function(res,req){
    res.render("contact");
})

app.get("/posts/:postId",function(req,res){
    Post.findOne({_id:req.params.postId},function(err,post){
        res.render("post",{title:post.title, content:post.content});

    });
});


app.post("/compose",function(req,res){
    const post = new Post({
        title:req.body.title,
        content:req.body.content
    });
    post.save();
    res.redirect("/")
})

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.email,
        password:req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            Post.find({},function(err,posts){
                if(!err){
                    res.render("home",{
                        posts:posts
                    });
                }
            })
        }
    });
});

app.post("/login",function(req,res){
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log(err);
        }
        else{
            if(user){
                if(user.password===req.body.password){
                    Post.find({},function(err,posts){
                        if(!err){
                            res.render("home",{
                                posts:posts
                            });
                        }
                    })
                }
        }
    }
    })
});


app.get("/compose",function(req,res){
    res.render("compose");
})
app.listen(3000);