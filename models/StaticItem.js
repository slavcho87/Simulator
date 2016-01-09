var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var StaticSchema   = new Schema({
    name: String
});
 
module.exports = mongoose.model('StaticItem', StaticSchema);
