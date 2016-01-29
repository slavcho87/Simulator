var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var MoveSchema   = new Schema({
    itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
    sceneId: { type: Schema.Types.ObjectId, ref: 'Scene' },
    mapId: { type: Schema.Types.ObjectId, ref: 'Map' },
    routeId: { type: Schema.Types.ObjectId, ref: 'Route' }
});
 
module.exports = mongoose.model('Move', MoveSchema);