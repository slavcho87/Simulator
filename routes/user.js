var express = require('express');
var jwt = require("jsonwebtoken");
var User = require('../models/User');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.post('/save', function(req, res, next) {
    User.findOne({name: req.body.userName}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var userModel = new User();
                userModel.name = req.body.userName;
                userModel.pass = req.body.pass;
                userModel.img = "";
                
                userModel.save(function(err, user) {
                    user.token = jwt.sign(user, 'sshhhhh');
                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                })
            }
        }
    });
});

router.post('/authenticate', function(req, res, next) {
    User.findOne({name: req.body.userName, pass: req.body.pass}, function(err, user){
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
               res.json({
                    type: true,
                    //data: user,
                    data: {login: "OK"},
                    token: user.token
                }); 
            } else {
                res.json({
                    type: false,
                    data: "Incorrect user/password"
                });    
            }
        }
    });
});

//tenemos que hacer que el usuario se coga del token
//este metodo tiene que ser controlado por sesion
//tambien lo tienen que ser as url's de mapa, configurations y simulator
router.post('/uploadPhoto', function(req, res) {    
    var img = req.files.imgPerfil;
    var fs = require('fs');
    
    fs.readFile(img.path, function (err, data) {
        var path = 'fotos/'+img.originalFilename;
        
        if (err){
            throw err;
        }else{        
            User.findOne({name: req.body.userName, pass: req.body.pass}, function(err, user){
                if (err) {

                } else {
                    if (user) {
                        user.img = data;
                        user.save();
                          
                        res.redirect('/#/configurations');
                        //res.json({upload: "OK"});
                    }else{
                        res.redirect('/#/configurations');
                        //res.json({upload: "NOK"});
                    }
                }
            });            
        } 
    });
});

module.exports = router;
