var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var MapSchema   = new Schema({
    name: String, 
    type: String, //private or public
    zoomLevel: { type: Number, min: 1, max: 22 },
    city: String,
    mapCenterLong: String,
    mapCenterLat: String,
    icono: String
});
 
module.exports = mongoose.model('Map', MapSchema);