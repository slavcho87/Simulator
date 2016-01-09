var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var DisplaySchema   = new Schema({
   itemName: String,
   scene_id: String,          
   map_id: String,                 
   recommender: String,   
   item_name: String,
   speed: Number,
});
 
module.exports = mongoose.model('Display', DisplaySchema);