const mongoose =require("mongoose");
var express=require("express");
const bcrypt=require("bcrypt");

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
    password: String
})

//creating model=======
var User=mongoose.model("User",details);





module.exports.createUser=function(data){

    bcrypt.hash(data.password, saltRounds, function(err, hash) {

         var newU= new User({
            userName: data.name,
            email: data.email,
            password: hash
        });
    
        newU.save(function(err){
          if(err)throw err;
        })   
        
      });

    
}


module.exports.login=function(data){

    User.findOne({userName:data.name},function(err,result){
        if(err)throw err;

        if(result!= null){

            bcrypt.compare(data.password, result.password, function(err, res) {
                if(err)throw err;
                if(res){
                    console.log(result);
                     return true;
                }else{
                    return false;
                }
            });
        }else{
                  return false;
            }
    })

}