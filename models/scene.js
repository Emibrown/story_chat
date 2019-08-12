var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');



var sceneSchema = mongoose.Schema(
    {	
    	number:{type: Number},
        story: {type: mongoose.Schema.Types.ObjectId, ref: 'Story'},
        background:{
            url:{type: String, default: null},
            name:{type: String, default: null}
        },
        conversation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation'}],
        createdOn: {type: Date, default: Date.now},
    }
)

sceneSchema.pre('save', function(next) {
  var scene = this;
  var Scenes = mongoose.model('Scene', sceneSchema);

  
  Scenes.find({story: scene.story},function(err, scenes){
    if(err) next(err)
     Scenes.count({story: scene.story}, function(err, count) {
        if (err) next(err)
        if (count == 0){
            scene.number = 1; 
            next();
            return;
        }
        if(scenes[count-1].number == count){
            scene.number = count + 1;
            next();
            return;
        }else{
        	scene.number = scenes[count-1].number + 1;
        	next();
            return;
        }
    });
  });

});


var Scene = mongoose.model('Scene', sceneSchema);

module.exports = Scene;