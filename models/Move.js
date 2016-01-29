var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var MoveSchema   = new Schema({
    sceneId: String,
    mapId: String,
    routeId: String
});
 
module.exports = mongoose.model('Move', MoveSchema);