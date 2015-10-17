var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var UserSchema   = new Schema({
    name: String, 
    pass: String, 
    img: String,
    token: String
});
 
module.exports = mongoose.model('User', UserSchema);