var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var SceneSchema   = new Schema({
    sceneName: String,
    city: String,
    latitudeULC: Number,
    longitudeULC: Number,
    latitudeLRC: Number,
    longitudeLRC: Number,
    maxStaticItems: Number,
    maxDynamicItems: Number,
    mapId: String,
    recommender: String,
    zoomLevel: Number,
    selectedCity: String,
    creationDate: Date
});
 
module.exports = mongoose.model('Scene', SceneSchema);