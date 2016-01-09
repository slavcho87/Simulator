var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var DynamicSchema   = new Schema({
    name: String,
    speed: Number,
});
 
module.exports = mongoose.model('DynamicItem', DynamicSchema);