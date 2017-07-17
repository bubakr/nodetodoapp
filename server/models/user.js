var mongoose = require('mongoose');
var User = mongoose.model('Users', {
    user: {
        type: String,
        required: true,
        minlength: 4,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 6
    }
});

module.exports = {User};
