var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var RatingSchema   = new Schema({
    userId: String, 
    itemId: String,
    value: Number,
    valueForecast: String
});
 
module.exports = mongoose.model('Rating', RatingSchema);