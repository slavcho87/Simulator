var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var LocationSchema   = new Schema({
    longitude: String,
    latitude: String,
    item: String,
});
 
module.exports = mongoose.model('Location', LocationSchema);