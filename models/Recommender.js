var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var RecommenderSchema   = new Schema({
    poolName: String,
    recommenderType: String,
    maximuDistanteToGo: Number,
    visibilityRadius: Number, 
    itemsToRecommend: Number,   
    minimumScore: Number,
    strategyType: String
});
 
module.exports = mongoose.model('Recommender', RecommenderSchema);