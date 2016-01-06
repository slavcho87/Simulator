var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var RouteSchema   = new Schema({
    longitude: String,
    latitude: String,
    itemName: String,
    sceneID: String,
    mapID: String
});
 
module.exports = mongoose.model('Route', RouteSchema);