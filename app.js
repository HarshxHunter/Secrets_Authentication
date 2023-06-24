require('dotenv').config();
const express= require("express");
const bodyParser = require("body-parser");
const ejs= require("ejs");
const mongoose = require("mongoose");
const bcrypt= require("bcrypt");
const saltRounds= 10;



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
    // putting the whole function of creating and saving the new user into brcrypt function
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser= new User({
        email: req.body.username,
        password: hash                
    });

    newUser.save()
        .then(()=>{
            res.render("secrets");
        })
        .catch((err)=>{
            console.log(err);
        })
        
    });

});



app.post("/login",function(req,res){
    const username= req.body.username;
    const password= req.body.password;          
    User.findOne({email: username})
        .then(function(foundUser){
            bcrypt.compare(password, foundUser.password, function(err, result) {   // using bcrypt.compare to compare entered password and stored password in DB and returning true or false in result 
                if(result === true){
                    res.render("secrets");
                }
            });
        })
        .catch((err)=>{
            console.log(err);
        })
});















app.listen(3000,function(){
    console.log("Server started on port 3000.");
});
