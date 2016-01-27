var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var RouteSchema   = new Schema({
    longitude: String,
    latitude: String,
    item: String,
    routePos: Number,
    sceneID: String,
    mapID: String,
    speed: Number,
});
 
module.exports = mongoose.model('Route', RouteSchema);