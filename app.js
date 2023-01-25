const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const Post = require('./models/post');
const app = express();
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/myblogDB",{useNewUrlParser:true});


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    Post.find({},function(err,posts){
        if(!err){
            res.render("home"),{
                posts:posts
            }
        }
    })
});

app.get("/compose",function(req,res){
    res.render("compose");
})
app.listen(3000);