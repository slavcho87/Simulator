var express = require('express');
var http = require('http');
var request = require('request');
var User = require('../models/User');
var Map = require('../models/Map');
var Scene = require('../models/Scene');
var Location = require('../models/Location');
var Route = require('../models/Route');
var Item = require('../models/Item');
var Move = require('../models/Move');
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
            var staticItemList = req.body.staticItemList; 
            var dynamicItemList = req.body.dynamicItemList;
            var locationsToSave = [];
            var dynamicItemToSave = [];
            var routeToSave = [];
            
            //Save static items
            for (index = 0; index < staticItemList.length; index++) {
                var location = new Location();
                location.longitude = staticItemList[index].longitude;
                location.latitude = staticItemList[index].latitude;
                location.sceneId = scene1._id;
                location.mapId = scene1.mapId;
                locationsToSave.push(location);
            }
            
            if(locationsToSave && locationsToSave.length>0){
                Location.create(locationsToSave, function(err, locations){
                    for(index=0; index<locations.length; index++){
                        var item = new Item();
                        item.itemName = staticItemList[index].name;
                        item.sceneId = scene1._id;
                        item.mapId = scene1.mapId;
                        item.itemType = staticItemList[index].type._id;
                        item.location = locations[index]._id;

                        item.save();
                    }
                });    
            }
            
            
            //Save dynamic items
            for (index = 0; index < dynamicItemList.length; index++) {
                var item = new Item();
                item.itemName = dynamicItemList[index].name;
                item.sceneId = scene1._id;
                item.mapId = scene1.mapId;
                item.itemType = dynamicItemList[index].type._id;
                dynamicItemToSave.push(item);
                
                var itemRoute = [];
                for (i = 0; i < dynamicItemList[index].route.length; i++) {
                    var route = new Route();
                    route.longitude = dynamicItemList[index].route[i].long;
                    route.latitude = dynamicItemList[index].route[i].lat; 
                    route.speed = dynamicItemList[index].speed;
                    route.routePos = i;
                    
                    itemRoute.push(route);
                }
                routeToSave.push(itemRoute);
            }
            
            if(routeToSave && routeToSave.length>0){    
                Item.create(dynamicItemToSave, function(err, items){
                    for(index=0; index<items.length; index++){
                        saveRoute(routeToSave[index], items[index], scene1);
                    }
                });   
            }
            
            resp.json({
                result: "OK",
                msg: "Scene saved successfully!",
                id: scene1._id,
                creationDate: scene1.creationDate
            });
        }
    });    
})

function formattDate(date){
    var d = date,
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
        
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('/');
}

function saveRoute(routeToSave, item, scene1){
    Route.create(routeToSave, function(err, routes){
        for(i=0; i<routes.length; i++){
            var move = new Move();
            move.itemId = item._id;
            move.sceneId = scene1._id;
            move.mapId = scene1.mapId;
            move.routeId = routes[i]._id;
            move.save();
        }
    });
}

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
            
            query.populate({
                path: 'userID',
                select: "token"
            });
            
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

router.get('/sceneListFromMapId/:mapId', function(req, res){
    Scene.find({mapId: req.params.mapId}, function(err, sceneList){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            res.json({
                result: "OK",
                sceneList: sceneList
            });
        }
    });
})

router.post('/itemList', function(req, res){
    Item.find({sceneId: req.body.sceneId, mapId: req.body.mapId})
    .populate({
        path: 'itemType',
        select: "icon type name _id"
    })
    .populate({
        path: 'location'
    })
    .exec(function(err, list){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            res.json({                   
                result: "OK",
                staticItemList: list
            });
        } 
    });
})

router.post('/dynamicItemRoute', function(req, res){
    Move.find({itemId: req.body.itemId, sceneId: req.body.sceneId, mapId: req.body.mapId})
    .populate({
        path: 'routeId',
    })
    .exec(function(err, list){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            res.json({
                result: "OK",
                route: list
            });
        }
    });
})

router.delete('/deleteMap/:id', function(req, res){
    Map.remove({_id: req.params.id}, function(err){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            Scene.remove({mapId: req.params.id}, function(err){
                if(err){
                    console.log(err);
                }    
            });
            
            Item.remove({mapId: req.params.id}, function(err){
                if(err){
                    console.log(err);
                }    
            });
            
            Location.remove({mapId: req.params.id}, function(err){
                if(err){
                    console.log(err);
                }    
            });
               
            Move.find({mapId: req.params.id}, function(err, moves){
                if(!err){
                    for(index in moves){
                        deleteRouteById(moves[index].routeId);
                        moves[index].remove();
                    }    
                }
            });
            
            res.json({ 
                result: "OK",
                msg: "Map deleted successfully!"
            });
        }
    });
})

function deleteRouteById(id){
    Route.findOne({_id: id}, function(err, route){
        console.log(route);
        if(!err){
            route.remove();
        }
    });
}

router.get('/editMapData/:mapId', function(req, res){
    Scene.find({mapId: req.params.mapId}, function(err, list){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            Map.findOne({_id: req.params.mapId}, function(err, map){
                if(err){
                    res.json({
                        result: "NOK",
                        msg: err
                    });
                }else{
                    res.json({
                        result: "OK",
                        sceneList: list,
                        map: map
                    });
                }
            });
        }
    });
})

router.post('/updateMap', function(req, res){
    var data = { 
        name: req.body.name,
        type: req.body.type,
        state: req.body.state,
    };
    
    Map.findOneAndUpdate({_id: req.body._id}, data, function(err){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            res.json({
                result: "OK",
                msg: "Map updated successfully!"
            });
        }
    });
})

router.post('/updateScene', function(req, res){
    var data = {
        sceneName: req.body.name,
        city: req.body.city,
        latitudeULC: req.body.latitudeULC,
        longitudeULC: req.body.longitudeULC,
        latitudeLRC: req.body.latitudeLRC,
        longitudeLRC: req.body.longitudeLRC,
        mapId: req.body.mapId,
        recommender: req.body.recommenderSettings,
        zoomLevel: req.body.zoom,
        selectedCity: req.body.selectedCity,
        creationDate: req.body.creationDate,
    };
    
    Scene.findOneAndUpdate({_id: req.body._id, mapId: req.body.mapId}, data, function(err, scene){    
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            //delete old locations, items and routes
            Location.remove({sceneId: req.body._id, mapId: req.body.mapId}, function(err){
                if(err){
                    console.log(err);
                }    
            });
            
            Item.remove({sceneId: req.body._id, mapId: req.body.mapId}, function(err){
                if(err){
                    console.log(err);
                }    
            });
            
            Move.find({sceneId: req.body._id, mapId: req.body.mapId}, function(err, moves){
                if(!err){
                    for(index in moves){
                        deleteRouteById(moves[index].routeId);
                        moves[index].remove();
                    }    
                }
            });
            
            updateStaticItems(req.body.mapId, req.body._id, req.body.staticItemList, scene);
            updateDynamicItems(req.body.mapId, req.body._id, req.body.dynamicItemList, scene);
            
            res.json({
                result: "OK",
                msg: "Scene updated successfully!"
            });
        }
    });
})

/*
 * Update static item list
 */
function updateStaticItems(mapId, sceneId, staticItemList, scene1){
    //Prepare Locations to save
    var locationsToSave = [];
    
    for (index = 0; index < staticItemList.length; index++) {
        var location = new Location();
        location.longitude = staticItemList[index].longitude;
        location.latitude = staticItemList[index].latitude;
        location.sceneId = scene1._id;
        location.mapId = scene1.mapId;
        locationsToSave.push(location);        
    }
    
    //Insert new locations and items
    if(locationsToSave && locationsToSave.length > 0){
        Location.create(locationsToSave, function(err, locations){        
            for(index=0; index<locations.length; index++){
                var item = new Item();
                item.itemName = staticItemList[index].name;
                item.sceneId = scene1._id;
                item.mapId = scene1.mapId;
                item.itemType = staticItemList[index].type._id;
                item.location = locations[index]._id;

                item.save();    
            }
        });   
    }
}

/*
 * Update dynamic item list
 */
function updateDynamicItems(mapId, sceneId, dynamicItemList, scene1){
    //Save dynamic items
    var dynamicItemToSave = [];
    var routeToSave = [];
    
    for (index = 0; index < dynamicItemList.length; index++) {
        var item = new Item();
        item.itemName = dynamicItemList[index].name;
        item.sceneId = scene1._id;
        item.mapId = scene1.mapId;
        item.itemType = dynamicItemList[index].type._id;
        dynamicItemToSave.push(item);
                
        var itemRoute = [];
        for (i = 0; i < dynamicItemList[index].route.length; i++) {
            var route = new Route();
            route.longitude = dynamicItemList[index].route[i].long;
            route.latitude = dynamicItemList[index].route[i].lat; 
            route.speed = dynamicItemList[index].speed;
            route.routePos = i;
                    
            itemRoute.push(route);
        }
        routeToSave.push(itemRoute);
    }
            
    if(dynamicItemToSave && dynamicItemToSave.length>0){
        Item.create(dynamicItemToSave, function(err, items){
                for(index=0; index<items.length; index++){
                    saveRoute(routeToSave[index], items[index], scene1);
                }
        });        
    }
}

router.post('/generateRandomWay', function(req, res){//req.body.
    var url = req.body.latitudeULC+','+req.body.longitudeLRC+','+req.body.latitudeLRC+','+req.body.longitudeULC;
    
    request('http://api.openstreetmap.org/api/0.6/map?bbox='+url, function (error, response, body) {
        var nodes = [];
        var motorway = [];
        var trunk = [];
        var primary = [];
        var secondary = [];
        var tertiary = [];
        var unclassified = [];
        var residential = [];
        var service = [];

        var DOMParser = require('xmldom').DOMParser;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(body, "text/xml");
        
        for(index in xmlDoc.getElementsByTagName("way")){
            var way = xmlDoc.getElementsByTagName("way")[index];
            var childNodes = way.childNodes;
            
            for(i in way.childNodes){
                var childNode = way.childNodes[i];
                
                if(childNode.nodeName == "tag"){
                    var k = childNode.getAttribute("k");
                    var v = childNode.getAttribute("v");
                    
                    if(k == "highway"){
                        switch(v) {
                            case "motorway":
                                motorway.push(way);
                                break;
                            case "trunk":
                                trunk.push(way);
                                break;
                            case "primary":
                                primary.push(way);
                                break;
                            case "secondary":
                                secondary.push(way);
                                break;
                            case "tertiary":
                                tertiary.push(way);
                                break;
                            case "unclassified":
                                unclassified.push(way);
                                break;
                            case "residential":
                                residential.push(way);
                                break;
                            case "service":
                                service.push(way);
                                break;
                        }
                    }
                }
            }
        }
        
        var itemList = [];
        for (index = 0; index < req.body.numberDynamicItems; index++) {
            var speed = Math.random() * (50 - 10) + 10;
            var wayIndex;
            var way;
            
            switch(req.body.wayType) {
                case "motorway":
                    wayIndex = Math.round(Math.random()*motorway.length);
                    way = motorway[wayIndex];                    
                    break;
                case "trunk":
                    wayIndex = Math.round(Math.random()*trunk.length); 
                    way = trunk[wayIndex];
                    break;
                case "primary":
                    wayIndex = Math.round(Math.random()*primary.length); 
                    way = primary[wayIndex];
                    break;
                case "secondary":
                    wayIndex = Math.round(Math.random()*secondary.length); 
                    way = secondary[wayIndex];
                    break;
                case "tertiary":
                    wayIndex = Math.round(Math.random()*tertiary.length); 
                    way = tertiary[wayIndex];
                    break;                    
                case "unclassified":
                    wayIndex = Math.round(Math.random()*unclassified.length); 
                    way = unclassified[wayIndex];
                    break;
                case "residential":
                    wayIndex = Math.round(Math.random()*residential.length); 
                    way = residential[wayIndex];
                    break;
                case "service":
                    wayIndex = Math.round(Math.random()*service.length); 
                    way = service[wayIndex];
                    break;        
            }
            
            var route = [];
            for(i in way.childNodes){ 
                var childNode = way.childNodes[i];
                
                if(childNode.nodeName == "nd"){
                    var ref = childNode.getAttribute("ref");
                    var lat = xmlDoc.getElementById(ref).getAttribute("lat");
                    var long = xmlDoc.getElementById(ref).getAttribute("lon");
                    
                    route.push({
                        long: lat,                             
                        lat: long
                    });
                }
            }
            
            itemList.push({      
                speed: speed,
                route: route   
            });
        }
        
        res.json({
            result: "OK",
            itemList: itemList
        }); 
    });
})
    

module.exports = router;