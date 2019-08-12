var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Admin = require('../models/admin');


passport.use('admin-local',new LocalStrategy({
    usernameField: 'email'},
	function(username, password, done) {
		 Admin.findOne({email : username}, function(err, admin){
            if(err){return done(err);}
            if(!admin){
                return done(null, false,
                 {message: "No Admin has that Email Address!"});
            }
            if (admin.password != password) {
				return done(null, false, {
				message: 'Incorrect password.'
				});
            }else{
                return done(null, admin);
            }
        });
	}
));
