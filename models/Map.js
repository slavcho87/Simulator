var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var MapSchema   = new Schema({
    name: String,
    type: String,
    state: String,
    userID: String,
    creationDate: Date
});
 
module.exports = mongoose.model('Map', MapSchema);