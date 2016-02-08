var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var MapSchema   = new Schema({
    name: String,
    type: String,
    state: String,
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    creationDate: Date
});
 
module.exports = mongoose.model('Map', MapSchema);