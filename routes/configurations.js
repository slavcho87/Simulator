var express = require('express');
var Recommender = require('../models/Recommender');
var Item = require('../models/Item');
var DynamicItem = require('../models/DynamicItem');
var StaticItem = require('../models/StaticItem');

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
                            msg: "Recommender saved successfully!"
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

router.post('/saveStaticItem', function(req, res, next){    
    var item = {
        name: req.body.name,
        icon: req.body.icon
    };
    
    Item.findOne({name: item.name}, function(err, findItem){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            if(!findItem){
                saveStaticItem(item, res);       
            }else{
                res.json({
                    result: "NOK",
                    msg: "Item exist! Please insert another item",
                });
            }
        }
    });
});

/*
 * Returns true if and only if item is successfully saved like static item
 */
function saveStaticItem(item, res){
    var itemModel = new Item();
    itemModel.name = item.name;
    itemModel.icon = item.icon;
    
    itemModel.save(function(err){
        if(err){
            res.json({
                result: "NOK",
                msg: "Item not saved!",
            });
        }else{
            var staticItemModel = new StaticItem();
            staticItemModel.name = item.name;
    
            staticItemModel.save(function(err){
                if(err){
                    res.json({
                        result: "NOK",
                        msg: "Item not saved!",
                    });
                }else{
                    res.json({
                        result: "OK",
                        msg: "Item saved successfully!",
                    });
                }
            });
        }
    });
}

/*
 * Return true if and only if existe name item into the data base
 */
function itemExist(item){
    Item.findOne({name: item.name}, function(err, findItem){
        if(err){
            console.log(1);
            return false;
        }else{
            if(!findItem){
                console.log(2);
                return false;
            }else{
                console.log(3);
                return true;
            }
        }
    });
}

router.get('/staticItemList', function(req, res, next){
    Item.find({}, function(err, itemList){
        StaticItem.find({}, function(err, staticItemList){
            var list = [];
            
            for(staticItemIndex in staticItemList){
                for(itemIndex in itemList){
                    if(staticItemList[staticItemIndex].name == itemList[itemIndex].name){
                        var item = itemList[itemIndex];
                        item.staticItemID=staticItemList[staticItemIndex]._id; 
                        
                        list.push(item);   
                    }
                }
            }
            
            res.json(list);
        });
    });
});

router.delete('/deleteStaticItem/:itemName', function(req, res, next){
    console.log(req.params.itemName);
    
    StaticItem.remove({name: req.params.itemName}, function(err){
       if(err){
            res.json({
                result: "NOK",
                msg: err
            });
       }else{
            Item.remove({name: req.params.itemName}, function(err){
                if(err){
                    res.json({
                        result: "NOK",
                        msg: err
                    }); 
                }else{
                    res.json({
                        result: "",
                        msg: "Static item deleted successfully!"
                    });
                }
            });      
       }
   });
});

router.post('/updateStaticItem', function(req, res, next){
    Item.findOneAndUpdate({_id: req.body._id}, req.body, function(err){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            var staticItemModel = new StaticItem();
            staticItemModel.name = req.body.name;
            
            StaticItem.findOneAndUpdate({name: req.body.staticItemID}, staticItemModel,function(err){
                if(err){
                    res.json({
                        result: "NOK",
                        msg: err
                    });  
                }else{
                    res.json({
                        result: "OK",
                        msg: "Static Item updated successfully!"
                    });
                }
            });
        }
    });
});


module.exports = router;
