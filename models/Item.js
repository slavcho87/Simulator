var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var ItemSchema   = new Schema({
    name: String,
    icon: String,
});
 
module.exports = mongoose.model('Item', ItemSchema);