var express = require('express');
var Recommender = require('../models/Recommender');
var router = express.Router();

router.post('/recommenderSave', function(req, res, next){
    Recommender.findOne({poolName: req.body.poolName}, function(err, recommender){
        console.log("err -> "+err);
        console.log("rec -> "+recommender);
        console.log(req.body);
        
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            if(!recommender){
                var recommederModel = new Recommender();
                recommederModel.poolName=req.body.poolName;
                recommederModel.recommenderType=req.body.type;
                recommederModel.maximuDistanteToGo=req.body.maxDistanceToGo;
                recommederModel.visibilityRadius=req.body.visibilityRadius;
                recommederModel.itemsToRecommend=req.body.numItemToRec;   
                recommederModel.minimumScore=req.body.minScoreForRec;

                recommederModel.save(function(err){
                    if(err){
                        res.json({
                            result: "NOK",
                            msg: err
                        });
                    }else{
                        res.json({
                            result: "OK",
                            msg: "Recommender save successfully!"
                        });
                    }
                });             
            }else{
                res.json({
                    result: "NOK",
                    msg: "Pool name exist! Insert new pool name"
                });
            }
        }
    });
});

router.get('/recommenderList', function(req, res, next){
    Recommender.find({}, function(err, recommenderList){
        res.json(recommenderList);
    });
});

router.delete('/deleteRecommender/:poolName', function(req, res, next){    
   Recommender.remove({poolName: req.params.poolName}, function(err){
       if(err){
            res.json({
                result: "NOK",
                msg: err
            });
       }else{
            res.json({
                result: "OK",
                msg: "Recommender deleted successfully!"
            });
       }
   });
});




module.exports = router;
