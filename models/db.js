var mongoose = require("mongoose");
//var dbURL = "mongodb://127.0.0.1:27017/storyChatDB";
var dbURL = "mongodb://u20wofpjldwlj8z:a95vqp2ZvAajsvyKN2si@bonoiciush6ngxf-mongodb.services.clever-cloud.com:27017/bonoiciush6ngxf";
mongoose.connect(dbURL);

mongoose.connection.on('connected', function(){
    console.log('mongoose connected to '+ dbURL);
});
mongoose.connection.on('error', function(err){
    console.log('mongoose connection error'+ err);
});
mongoose.connection.on('disconnected', function(){
    console.log('mongoose disconnected ' );
});