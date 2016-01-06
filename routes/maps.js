var express = require('express');
var http = require('http');
var request = require('request');
var User = require('../models/User');
var Map = require('../models/Map');
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
            resp.json({result: "NOK"});
        } else {
            var mapModel = new Map();
            mapModel.name = req.body.name; 
            mapModel.type = req.body.type;
            mapModel.state = req.body.state;
            mapModel.userToken = req.token;
            
            mapModel.save(function(err){
                if(err){
                    resp.json({       
                        result: "NOK",       
                        msg: "ERROR: Could not save the map!"
                    });    
                }else{
                    resp.json({        
                        result: "OK",
                        msg: "Map created successfully!"    
                    }); 
                }
            });
        }
    });
})

module.exports = router;