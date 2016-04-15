var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var RatingSchema   = new Schema({
    userId: String, 
    itemId: String,
    value: Number,
    valueForecast: String,
    recommenderId: { type: Schema.Types.ObjectId, ref: 'Recommender' }
});
 
module.exports = mongoose.model('Rating', RatingSchema);