var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');



var conversationSchema = mongoose.Schema(
    {
    	scene: {type: mongoose.Schema.Types.ObjectId, ref: 'Scene'},
        character: {type: String, required: true},
        message:{type: String, required: true},
    }
)


var Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;