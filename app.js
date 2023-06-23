require('dotenv').config();
const express= require("express");
const bodyParser = require("body-parser");
const ejs= require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");


const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB")
    .then(()=> console.log("Connected to userDB."))
    .catch((err)=> console.log(err))


// console.log(process.env.API_KEY);

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});




const User = mongoose.model("User",userSchema);





app.get("/",function(req,res){
    res.render("home");
});


app.get("/login",function(req,res){
    res.render("login");
});


app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register",function(req,res){
    const newUser= new User({
        email: req.body.username,
        password: md5(req.body.password)                 // hash the password when storing in DB and cannot be un hashed again to original password
    });

    newUser.save()
        .then(()=>{
            res.render("secrets");
        })
        .catch((err)=>{
            console.log(err);
        })
});



app.post("/login",function(req,res){
    const username= req.body.username;
    const password= md5(req.body.password);          // take the input password and hash it and then compare it with the stored password if same then right password entered and if not then wrong password as hashing function is same i.e, md5  

    User.findOne({email: username})
        .then(function(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        })
        .catch((err)=>{
            console.log(err);
        })
});















app.listen(3000,function(){
    console.log("Server started on port 3000.");
});
