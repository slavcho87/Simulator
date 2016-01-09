var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var ItemSchema   = new Schema({
    name: String,
    icon: String,
    type: String, //static, dynamic
});
 
module.exports = mongoose.model('Item', ItemSchema);