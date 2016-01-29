var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var ItemTypeSchema   = new Schema({
    name: String,
    icon: String,
    type: String, //static, dynamic
});
 
module.exports = mongoose.model('ItemType', ItemTypeSchema);