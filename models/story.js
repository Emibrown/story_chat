var mongoose = require('mongoose');


var subjectSchema = mongoose.Schema(
    {
        title: {type: String, required: true},
        cover:{
            url:{type: String, required: true},
            name:{type: String, required: true}
        },
        characters: [{type: String}],
        createdOn: {type: Date, default: Date.now},
    }
)

var Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;