var express = require('express');
var http = require('http');
var request = require('request');
var User = require('../models/User');
var Map = require('../models/Map');
var Scene = require('../models/Scene');
var router = express.Router();

/*
 * Search city by name
 */
router.get('/city/search/:location', function(req, resp){
    var city = req.params.location;
   
    request('http://nominatim.openstreetmap.org/search.php?city='+city+'&format=json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var lista = [];
            var json = JSON.parse(body);
            
            for (i=0;i<json.length;i++){    
                if(json[i].type=='city'){    
                    lista.push(json[i]);
                }
            }

            resp.json(lista);
        }
    })    
})

/*
 * Save new map into the data base 
 */
router.post('/save', function(req, resp){
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            resp.json({
                result: "NOK", 
                msg: err
            });
        } else {
            var mapModel = new Map();
            mapModel.name = req.body.name; 
            mapModel.type = req.body.type;
            mapModel.state = req.body.state;
            mapModel.userID = user._id;
            mapModel.creationDate = new Date();
            
            mapModel.save(function(err, map){
                if(err){
                    resp.json({       
                        result: "NOK",       
                        msg: "ERROR: Could not save the map!"
                    });    
                }else{
                    resp.json({        
                        result: "OK",
                        msg: "Map created successfully!",
                        id: map._id
                    }); 
                }
            });
        }
    });
})

router.post('/saveScene', function(req, resp){
    var scene = new Scene();
    scene.sceneName = req.body.name;
    scene.city = req.body.citySearchValue; 
    scene.latitudeULC = req.body.latitudeULC;
    scene.longitudeULC  = req.body.longitudeULC;
    scene.latitudeLRC  = req.body.latitudeLRC;
    scene.longitudeLRC = req.body.longitudeLRC;
    scene.maxStaticItems = req.body.maximumStaticItemsToDisplay; 
    scene.maxDynamicItems = req.body.maximumStaticItemsToDisplay;
    scene.mapId = req.body.mapId;
    scene.recommender = req.body.recommenderSettings;
    scene.zoomLevel = req.body.zoom;
    scene.selectedCity = req.body.selectedCity;
    scene.creationDate = new Date();
    
    scene.save(function(err, scene1){
        if(err){
            resp.json({
                result: "NOK",
                msg: err
            });
        }else{
            resp.json({
                result: "OK",
                msg: "Scene saved successfully!",
                id: scene1._id,
                creationDate: scene1.creationDate
            });
        }
    });    
})

router.delete('/deleteScene/:sceneID', function(req, res){    
    Scene.remove({_id: req.params.sceneID}, function(err, scene){
       if(err){
            res.json({
                result: "NOK",
                msg: err
            });
       }else{
            res.json({
                result: "OK",
                msg: "Scene deleted successfully!"
            });
       }
   });
})

router.post('/findMaps', function(req, res){
    /*req.body.city: "wwww"
        req.body.endDate: "2016-01-30"
        req.body.name: "qqq"
    req.body.onlyMyMaps: true
        req.body.startDate: "2016-01-11"
    req.body.state: "draft"
    req.body.type: "all"*/
    
    User.findOne({token: req.token}, function(err, user) {
        if(err){
           res.json({
                result: "NOK",
                msg: err
           });
        }else{
            var query;
            if(req.body.onlyMyMaps){
                query = Map.find({userID: user._id});
            }else{
                query = Map.find({});
            }
                        
            if(req.body.name){
                query.where('name').equals(req.body.name);    
            }
            
            if(req.body.startDate && req.body.endDate){
                query.where('creationDate').gte(req.body.startDate).lte(req.body.endDate);
            }
                
            if(req.body.type && req.body.type!="all"){
                query.where('type').equals(req.body.type);
            }

            if(req.body.state && req.body.state!="all"){
                query.where('state').equals(req.body.state);        
            }
                
            query.exec(function(err, list){
                if(err){
                    res.json({
                        result: "NOK",
                        msg: err
                    });
                }else{
                    res.json({
                        result: "OK",
                        mapList: list
                    });    
                }                
            });
        }
    });
})

module.exports = router;