var express=require("express");
var bodyParser=require("body-parser");
var control=require("./controller");
var session = require('express-session');
var passport=require("passport")


var app = express();
app.set('view engine', 'ejs')
//serving static files=================

app.use("/public",express.static('public'));


//firing control by passing app whichwill be use to control routes=============

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




  app.use(control);

app.listen(3000,function(){
    console.log("listening to 3000");
})