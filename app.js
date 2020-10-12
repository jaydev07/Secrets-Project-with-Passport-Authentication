require('dotenv').config();
const express =require("express");
const app=express();
const bodyParser=require("body-parser");
const ejs=require('ejs');
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology: true});

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

console.log(process.env.API_KEY);

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

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
  var eId=req.body.username;
  var userPassword=req.body.password;
  const user = new User({
    email:eId,
    password:userPassword
  });
  user.save(function(err){
    if(!err){
      res.render("secrets");
    }
    else{
      console.log(err);
    }
  });
});

app.post("/login",function(req,res){
  var eId=req.body.username;
  var userPassword=req.body.password;
  User.findOne({email:eId},function(err,foundUser){
    if(err){
      console.log(err);
    }

    else{

      if(foundUser){

        if(foundUser.password===userPassword){
          res.render("secrets");
        }
        else{
          res.send("Wrong Password");
        }

      }
      else{

        res.send("You Have Not Registered Yet");

      }
    }
  });
});

app.listen(3000,function(){
  console.log("Server is on port 3000");
});
