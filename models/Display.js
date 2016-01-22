var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var DisplaySchema   = new Schema({
   itemType: String, 
   itemId: String,
   sceneId: String,          
   mapId: String,                 
   recommender: String,   
   itemName: String,
});
 
module.exports = mongoose.model('Display', DisplaySchema);