var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var MapSchema   = new Schema({
    name: String,
    type: String,
    state: String,
    userName: String,
    password: String,
});
 
module.exports = mongoose.model('Map', MapSchema);