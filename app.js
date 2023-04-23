const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const Post = require('./models/post');
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const PORT = process.env.PORT || 4000;
require("dotenv").config();
const uri = "mongodb+srv://Siddhant:KqYfcwW1nSlbLpcd@posts.g7wdvup.mongodb.net/MyBlog?retryWrites=true&w=majority";

mongoose.connect(uri).then(() =>{
    console.log("Connected to DB");
} ).catch((err)=>{console.log(err)});

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret:"one",
    saveUninitialized:false,
    resave:false
}))

app.use(passport.initialize());
app.use(passport.session());


// mongoose.connect("mongodb://0.0.0.0:27017/myblogDB",{useNewUrlParser:true});


const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/",function(req,res){
    Post.find({},function(err,posts){
        if(!err){
            res.render("home",{
                posts:posts
            });
        }
    })
});

app.get("/about",function(req,res){
    res.render("about");
})

app.get("/contact",function(req,res){
    res.render("contact");
})

app.get("/posts/:postId",function(req,res){
    Post.findOne({_id:req.params.postId},function(err,post){
        res.render("post",{title:post.title, content:post.content});

    });
});

app.get("/posts/:postsId/delete",function(req,res){
    Post.findOneAndDelete({_id:req.params.postsId},function(err){
        if(!err){
            res.redirect("/home-auth");
        }
    })
});


app.get("/logout",function(req,res){
    req.logout(function(err){
        console.log(err);
    });
    res.redirect("/");
})

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/compose",function(req,res){
    res.render("compose");
});

app.get("/home-auth",function(req,res){
    if(req.isAuthenticated()){
        Post.find({},function(err,posts){
            if(!err){
                res.render("home-auth",{
                    posts:posts
                });
            }
        })
    }
    else{
        res.redirect("/login");
    }
});

app.post("/compose",function(req,res){
    const post = new Post({
        title:req.body.title,
        content:req.body.content
    });
    post.save();
    res.redirect("/home-auth");
})

app.post("/register",function(req,res){
    User.register({username:req.body.email},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/home-auth");
            });
        }
    });
});

app.post("/login",function(req,res){
    const user = new User({
        username: req.body.email,
        password:req.body.password
    });
    req.login(user,function(err){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/home-auth");
            });
        }
    });

});


app.get("/compose",function(req,res){
    res.render("compose");
})
app.listen(PORT);