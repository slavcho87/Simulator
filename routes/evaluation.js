var express = require('express');
var router = express.Router();
var Recommender = require('../models/Recommender');
var Scene = require('../models/Scene');
var Map = require('../models/Map');
var Rating = require('../models/Rating');

router.get('/loadMapsAndScenesFormRecommenderId/:recommenderId', function(req, res){
    var recommenderId = req.params.recommenderId;
    Scene.find({recommender: recommenderId}, function(err, sceneList){
        if (err) {
            res.json({
                result: "NOK",
                msg: err
            });   
        }else{
            Map.find({}, function(err2, mapList){
                if(err2){
                    res.json({
                        result: "NOK",
                        msg: err2
                    });       
                }else{
                    var result = [];
                    for(index in mapList){
                        result.push({
                            map: mapList[index],
                            sceneList: getScenes(mapList[index]._id, sceneList)
                        });
                    }
                    
                    res.json({
                        result: "OK",
                        list: result 
                    });
                }
            });
        } 
    });
})

function getRating(itemId, userId){
    Rating.findOne({itemId: itemId, userId: userId})
    .populate({
        path: 'itemId'
    }).exec(function(err, itemList){
        if(!err){
            return itemList;
        }
    });
}

router.post('/getRatingData', function(req, res){
    var itemIdList = [];
    for(index in req.body.itemList){
        itemIdList.push(req.body.itemList[index]._id);
    }
    
    Rating.find({itemId: {$in: itemIdList}, userId: req.body.user})
    .populate({
        path: 'itemId'
    }).exec(function(err, itemList){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            res.json({
                result: "OK",
                itemList: itemList
            });
        }
    });
})

function getScenes(mapId, sceneList){
    var scenes = [];
    for(index in sceneList){
        if(sceneList[index].mapId == mapId){
            scenes.push(sceneList[index]);
        }
    }
    return scenes;
}

module.exports = router;
