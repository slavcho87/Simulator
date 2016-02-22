var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var UserMoveSchema   = new Schema({
    mapId: { type: Schema.Types.ObjectId, ref: 'Map' },
    sceneId: { type: Schema.Types.ObjectId, ref: 'Scene' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    longitude: String,
    latitude: String,
    creationDate: Date
});
 
module.exports = mongoose.model('UserMove', UserMoveSchema);