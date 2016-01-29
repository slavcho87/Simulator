var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var RouteSchema   = new Schema({
    longitude: String,
    latitude: String,
    speed: Number,
    routePos: Number
});
 
module.exports = mongoose.model('Route', RouteSchema);