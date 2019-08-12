var passport = require('passport');
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var mime = require('mime-types');
var Story = require('../../models/story');
var Admin = require('../../models/admin');
var Scene = require('../../models/scene');
var Conversation = require('../../models/conversation');
var shortid = require('shortid');
var Multer = require('multer');
var fs = require('fs');

var auth = jwt({
	secret: 'thisIsSecret',
	userProperty: 'payload'
});

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var storyStorage = Multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/upload/story')
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() +"." + mime.extension(file.mimetype))
    }
});

var sceneStorage = Multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/upload/scene')
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() +"." + mime.extension(file.mimetype))
    }
});

var storyUpload = Multer({ //multer settings
    storage: storyStorage,
    fileFilter: function(req, file, cb){
     if(!req.body.title ){
     	req.bodyValidationError = "All fields required";
        return cb(new Error('All fields required'))
	  }
     if(file.mimetype !== mime.lookup('jpg') && file.mimetype !== mime.lookup('png')){
        req.fileValidationError = "Only jpg and png files are allowed";
        return cb(new Error('Only jpg and png files are allowed'))
      }
      cb(null, true)
    }
}).single('file');

var sceneUpload = Multer({ //multer settings
    storage: sceneStorage,
    fileFilter: function(req, file, cb){
     if(file.mimetype !== mime.lookup('jpg') && file.mimetype !== mime.lookup('png')){
        req.fileValidationError = "Only jpg and png files are allowed";
        return cb(new Error('Only jpg and png files are allowed'))
      }
      cb(null, true)
    }
}).single('file');

// Admin API

router.post('/register', function(req, res, next) {
  if(!req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "All fields required"
		});
		return;
	}
	Admin.findOne({email : req.body.email}, function(err, email){
            if(err){return done(err);}
            if(email){
               sendJSONresponse(res, 400, {
					"message": "Email already in use"
				});
               return;
            }else{
            	var newAdmin = new Admin();
				newAdmin.email = req.body.email;
				newAdmin.password = req.body.password;
				newAdmin.save(function(err, admin) {
					if (err) {
						sendJSONresponse(res, 404, err);
					} else {
						token = admin.generateJwt();
						sendJSONresponse(res, 200, {
							"token" : token
						});
					}
				});
            }
        });
});

router.post('/login', function(req, res, next) {
  if(!req.body.email || !req.body.password){
  		sendJSONresponse(res, 400, {"message": "All fields required"});
		return;
	}
	passport.authenticate('admin-local', function(err, admin, info){
	if (err) {
		sendJSONresponse(res, 404, err);
		return;
	}
	if(admin){
		token = admin.generateJwt();
		sendJSONresponse(res, 200, {
			"token" : token
		});
	} else {
		sendJSONresponse(res, 401, info);
	}
	})(req, res);
});


router.post('/add-story', auth, function(req, res, next) {
  	storyUpload(req,res,function(err){
  	 if(!req.body.title || !req.file){
     	sendJSONresponse(res, 400, {"message": "All fields required"});
	    return;
	  }
	  if(req.bodyValidationError){
	    sendJSONresponse(res, 400, {"message": req.bodyValidationError});
	    return;
	  }
	  if(req.fileValidationError){
	    sendJSONresponse(res, 400, {"message": req.fileValidationError});
	    return;
	  }
	  if(req.file){
	  	 var newStory = new Story({
		    title : req.body.title,
		    cover:{
		    	url: "http://"+req.headers.host+"/upload/story/"+req.file.filename,
		    	name:req.file.filename
		    }
		  });
	  }
	  newStory.save(function(err, story){
	    if (err) { 
	        return next(err); 
	    }else{
	        sendJSONresponse(res, 200, {
	        	_id: story._id,
	        	title: story.title,
	        	cover: {
	        		url: story.cover.url
	        	},
	        });
	    }
	  });
  	});
});

router.get('/stories', auth, function(req, res, next) {
   Story.find({},{ 
    _id:1,
    title: 1,
    cover:1
  }).
    exec(function(err, story) {
    if (err) { return next(err); }
    if (!story) { return next(404); }
    sendJSONresponse(res, 200, story);
  });
});

router.get('/stories/:id/scenes', auth, function(req, res, next) {
   Scene.find({story: req.params.id},{ 
    _id:1,
    number: 1,
    background:1
  }).
    exec(function(err, scene) {
    if (err) { return next(err); }
    if (!scene) { return next(404); }
    sendJSONresponse(res, 200, scene);
  });
});


router.post('/add-scene/:id', auth, function(req, res, next) {
	Story.findOne({_id : req.params.id}, function(err, story){
        if(err){ return done(err);}
        if (!story) { return next(404); }
	  	var newScene = new Scene({
	  	 	story: req.params.id,
		});
		newScene.save(function(err, scene){
		    if (err) { 
		        return next(err); 
		    }else{
		        sendJSONresponse(res, 200, {
		        	_id: scene._id,
		        	number: scene.number,
		        	background: {
		        		url: scene.background.url
		        	},
		        });
		    }
		});
	});
});

router.post('/add-character/:id', auth, function(req, res, next) {
	if(!req.body.name){
	 	sendJSONresponse(res, 400, {"message": "All fields required"});
	    return;
	}
	Story.findOne({_id : req.params.id}, function(err, story){
        if(err){ return done(err);}
        if (!story) { return next(404); }
	  	var character = req.body.name; 
	  	Story.update({_id: req.params.id},{ $push:{  characters: character } }, function(err) {
	        if (err) {   return next(err); }
	        sendJSONresponse(res, 200, {"message": "Character added successfully."});
	        return;
	    });
	});
});

router.post('/add-conversation/:id', auth, function(req, res, next) {
	if(!req.body.character || !req.body.message){
	 	sendJSONresponse(res, 400, {"message": "All fields required"});
	    return;
	}
	Scene.findOne({_id : req.params.id}, function(err, scene){
        if(err){ return done(err);}
        if (!scene) { return next(404); }
	  	var newConversation = new Conversation({
	  		scene: req.params.id,
	  	 	character: req.body.character,
	  	 	message: req.body.message
		});
		newConversation.save(function(err, conversation){
		    if (err) { 
		        return next(err); 
		    }else{
		    	Scene.update({_id: req.params.id},{ $push:{  conversation: conversation._id } }, function(err) {
			        if (err) {   return next(err); }
			        sendJSONresponse(res, 200, conversation);
			        return;
			    });
		    }
		});
	});
});

router.get('/scenes/:id/conversations', auth, function(req, res, next) {
	Scene.findOne({_id: req.params.id})
		.populate('story', 'characters')
	    .exec(function(err, scene) {
	    if (err) { return next(err); }
	    if (!scene) { return next(404); }
	    Conversation.find({scene: req.params.id},{ 
		    _id:1,
		    scene: 1,
		    character: 1,
		    message:1
		    }).
		    exec(function(err, conversation) {
		    if (err) { return next(err); }
		    if (!conversation) { return next(404); }
		    sendJSONresponse(res, 200, {
		    	conversation: conversation,
		    	scene: scene
		    });
		});
	});
});


// Users API

router.get('/user/stories', function(req, res, next) {
   Story.find({},{ 
    _id:1,
    title: 1,
    cover:1
  }).
    exec(function(err, story) {
    if (err) { return next(err); }
    if (!story) { return next(404); }
    sendJSONresponse(res, 200, story);
  });
});


router.get('/user/stories/:id/scenes',function(req, res, next) {
   Scene.find({story: req.params.id},{ 
    _id:1,
    number: 1,
    background:1,
    conversation: 1
  })
   .populate('conversation')
    .exec(function(err, scene) {
    if (err) { return next(err); }
    if (!scene) { return next(404); }
    sendJSONresponse(res, 200, scene);
  });
});


  
module.exports = router;
