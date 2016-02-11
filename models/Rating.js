var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var RatingSchema   = new Schema({
    userId: String, 
    itemId: String,
    value: Number
});
 
module.exports = mongoose.model('Rating', RatingSchema);