var express=require("express");
var router=express.Router();
const mongoose =require("mongoose");
var express=require("express");
const bcrypt=require("bcrypt");
var passport=require("passport")
var session = require('express-session');
var app=express();
app.use(require('cookie-parser')());

app.use(session({
  secret: 'somerandomstring',
  resave: true,
  saveUninitialized: false,   //false for only login user cookies and true for every time
  //cookie: { secure: true }
}))





const saltRounds = 10;
var router=express.Router();
var hashP;

//conecting to mongodb=====

mongoose.connect('mongodb://localhost/WalletUsers',{ useNewUrlParser: true },function(err){

  if(err)throw err;

});

mongoose.connection.once('open',function(){
    console.log("connected to database");   
});


// creating schema 

var details=mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    balance:Number
})

//creating model=======
var User=mongoose.model("User",details);




//routes==========================================  

router.get("/",function(req,res){
  res.render("home");

  //  console.log(data);
});


router.get("/signup",function(req,res){
    res.render("signup");
    
  });


 router.post("/",function(req,res){
  
   User.findOne({userName:req.body.name},function(err,result){
    if(err)throw err;

    if(result!= null){

        bcrypt.compare(req.body.password, result.password, function(err, res1) {
            if(err)throw err;
            if(res1){
              session.user=result._id;
               res.redirect('/main');
            }else{
            res.end("login failed");

            }
        });
    }else{
      res.end("login failed");
    }
})
});

  
router.post("/signup",function(req,res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

  var newU= new User({
     userName: req.body.name,
     email: req.body.email,
     password: hash
 });

 newU.save(function(err){
   if(err)throw err;
 })   
 
});

      
      res.end("You are a WalletCTRL User");
  });


router.get("/main",function(req,res){
  User.findById(session.user,(err,result) =>{

    res.render("main",{result});

  });


})  


router.post("/main",function(req,res){
  let tempAmount;

  User.findById(session.user,(err,result)=>{
        if(err)throw err;
      
      var nresult=JSON.parse(result.balance);
      var amount=JSON.parse(req.body.amount);
    

      if(result.balance==null){
        tempAmount=amount;
      }else{
        tempAmount=amount+nresult;
      }
 
  User.updateOne({_id:session.user},{balance:tempAmount},(err,result) =>{
      if(err)throw err;
  })
  res.redirect("/main");
})

 // User.findById(session.user,(err,result)=>{
//   if(err)throw err;
//    console.log(result)
//    res.render("main",{result});
//  })
  
});  





//db middleware=============================================


//delete==============================================

module.exports=router;

