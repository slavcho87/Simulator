var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var ItemSchema   = new Schema({
    name: String,
    icon: String,
    speed: Number,
    itemName: String,
    sceneId: String,
    mapId: String
});
 
module.exports = mongoose.model('Item', ItemSchema);