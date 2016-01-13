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
    recommender: String
    zoomLevel: { type: Number, min: 1, max: 22 },
    selectedCity: String
});
 
module.exports = mongoose.model('Scene', SceneSchema);