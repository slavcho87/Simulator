var express = require('express');
var Recommender = require('../models/Recommender');
var ItemType = require('../models/ItemType');
var Rating = require('../models/Rating');
var request = require('request');
var fs = require('fs');
var router = express.Router();

router.post('/recommenderSave', function(req, res, next){
    Recommender.findOne({poolName: req.body.poolName}, function(err, recommender){ 
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
                recommederModel.itemsToRecommend=req.body.numItemToRecs;
                recommederModel.minimumScore=req.body.minScoreForRec;
                recommederModel.strategyType=req.body.strategyType;

                recommederModel.save(function(err, recommender){
                    if(err){
                        res.json({
                            result: "NOK",
                            msg: err
                        });
                    }else{
                        res.json({
                            result: "OK",
                            msg: "Recommender saved successfully!",
                            _id: recommender._id
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

router.get('/searchRecommenderById/:id', function(req, res){
    Recommender.findOne({_id: req.params.id}, function(err, recommender){
        if(err){
            res.json({
               result: "NOK",
                msg: err
            });
        }else{
            res.json({
                result: "OK",
                recommender: recommender
            });
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

router.post('/updateRecommender', function(req, res, next){    
    Recommender.findOneAndUpdate({_id: req.body._id}, req.body, function(err){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            res.json({
                result: "OK",
                msg: "Recommender updated successfully!"
            });
        }
    });
});

router.post('/saveItem', function(req, res, next){
    ItemType.findOne({name: req.body.name}, function(err, findItem){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            if(!findItem){
                var itemModel = new ItemType();
                itemModel.name = req.body.name;
                itemModel.icon = req.body.icon;
                itemModel.type = req.body.type;
                
                itemModel.save(function(err){
                    if(err){
                        res.json({
                            result: "NOK",
                            msg: err
                        });
                    }else{
                        res.json({
                            result: "OK",
                            msg: "Item saved successfully"
                        });
                    }
                });
            }else{
                res.json({
                    result: "NOK",
                    msg: "Item exist! Please insert another item",
                });
            }
        }
    });
});

router.get('/staticItemList', function(req, res, next){
    ItemType.find({type: "static"}, function(err, list){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            res.json(list);
        }
    });
});

router.get('/dynamicItemList', function(req, res, next){
    ItemType.find({type: "dynamic"}, function(err, list){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            res.json(list);
        }
    });    
});

router.post('/updateItem', function(req, res, next){
    ItemType.findOneAndUpdate({_id: req.body._id}, req.body, function(err){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            res.json({
                result: "OK",
                msg: "Item update successfully!"
            });
        }
    });    
});

router.delete('/deleteItem/:itemName', function(req, res, next){
    ItemType.remove({name: req.params.itemName}, function(err){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            res.json({
                result: "OK",
                msg: "Item deleted successfully!"
            });
        }
    });
});

function baseConfig(){
    var file = fs.readFileSync('./baseConfig.json', 'utf8');
    return JSON.parse(file);
}

router.get('/recommenderTypes', function(req, res){
    var url = "\'"+baseConfig().urlRecommender+"\'";
    
    request(url, function (error, response, body) {    
        console.log(error);
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    });
    
    res.json({ok: "OK"});
})

router.post('/setRating', function(req, res){
    Rating.find({itemId:req.body.itemId, userId: req.token}, function(err, list){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            if(list.length==0){
                var rating = new Rating();    
                rating.userId=req.token;
                rating.itemId=req.body.itemId; 
                rating.value=req.body.rating;
                rating.valueForecast = req.body.valueForecast; 
                rating.recommenderId = req.body.recommenderId;

                rating.save(function(err){
                    if(err){
                        res.json({
                            result: "NOK",
                            msg: err
                        });
                    }else{
                        res.json({
                            result: "OK",
                            msg: "Ratings assigned successfully!"
                        });
                    }
                });
            }else{
                res.json({
                    result: "NOK",
                    msg: "You have already voted in this item!"
                });
            }    
        }
    });
})



module.exports = router;
