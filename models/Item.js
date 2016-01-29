var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var ItemSchema   = new Schema({
    itemName: String,
    sceneId: String,
    mapId: String,
    itemType: { type: Schema.Types.ObjectId, ref: 'ItemType' },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
});
 
module.exports = mongoose.model('Item', ItemSchema);