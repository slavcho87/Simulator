var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var MapSchema   = new Schema({
    name: String,
    type: String,
    state: String,
    userToken: String,
});
 
module.exports = mongoose.model('Map', MapSchema);