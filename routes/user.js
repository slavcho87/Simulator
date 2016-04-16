var express = require('express');
var jwt = require("jsonwebtoken");
var User = require('../models/User');
var UserMove = require('../models/UserMove');
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
                userModel.img = req.body.img;
                
                userModel.save(function(err, user) {
                    var img = user.img;
                    user.img = "";
                    
                    user.token = jwt.sign(user, 'sshhhhh');
                    user.img = img;
                    
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

router.post('/updatePassword', ensureAuthorized, function(req, res, next){
    User.findOne({token: req.token}, function(err, user) {
         if (err) {
            resp.json({
                result: "NOK", 
                msg: err
            });
        }else{
            if(req.body.currentPass==user.pass){
                if(req.body.newPass == req.body.newPassRepeat){
                    var img = user.img;
                    user.img = "";
                    
                    user.pass = req.body.newPass;
                    user.token = jwt.sign(user, 'sshhhhh');
                    user.img = img;

                    //NOTA!!! Tenemos que cambiar el token en el mapa tambien
                    
                    user.save(function(err, user1){
                        if(err){
                            res.json({
                                result: "NOK",
                                msg: err
                            });
                        }else{
                            res.json({
                                result: "OK",
                                token: user1.token,
                                msg: "Password updated successfully!"
                            });
                        }
                    });
                }else{
                    res.json({
                        result: "NOK",
                        msg: "New passwords do not match!"
                    });
                }
            }else{
                res.json({
                    result: "NOK",
                    msg: "Incorrect current password!"    
                });
            }
        }
    });
});

router.post('/updateUserName', ensureAuthorized, function(req, res, next){
    User.findOne({token: req.token}, function(err, user){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            if(req.body.newUserName==req.body.repatNewUserName){
                var img = user.img;
                user.img = "";
                
                user.name = req.body.newUserName;
                user.token = jwt.sign(user, 'sshhhhh');
                user.img = img;
                
                user.save(function(err, user1){
                    if(err){
                        res.json({
                            result: "NOK",
                            msg: err
                        });
                    }else{
                        res.json({
                            result: "OK",
                            msg: "User name updated successfully!",
                            token: user1.token
                        });
                    }
                });
            }else{
                res.json({
                    result: "NOK",
                    msg: "User names not match!"
                });
            }
        }
    });
});

router.post('/uploadPhoto', ensureAuthorized, function(req, res) {    
    User.findOne({token: req.token}, function(err, user){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            user.img = req.body.img;
            user.save(function(err){
                if(err){
                    res.json({
                        result: "NOK",
                        msg: err
                    });
                }else{
                    res.json({
                        result: "OK",
                        msg: "Image updated successfully"
                    });
                }
            });
        }
    });
});

router.get('/img', ensureAuthorized, function(req, res){
    User.findOne({token: req.token}, function(err, user){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            res.json({
                result: "OK",
                img: user.img
            });
        }
    });
});

router.post('/userMove', ensureAuthorized, function(req, res){   
    User.findOne({token: req.token}, function(err, user){
        if(!err){
            var userMove = new UserMove();
            userMove.mapId = req.body.mapId;
            userMove.sceneId = req.body.sceneId;
            userMove.userId = user._id;
            userMove.longitude = req.body.location.longitude;
            userMove.latitude = req.body.location.latitude;
            userMove.creationDate = new Date();
            
            userMove.save();
            
            res.json({
                result: "OK"
            });
        }
    });
})

router.get('/getUserList', ensureAuthorized, function(req, res){
    User.find({}, function(err, userList){
        if(err){
            res.json({
                result: "NOK",
                msg: err
            });
        }else{
            var list = [];
            for(index in userList){
                list.push({
                    name: userList[index].name,
                    token: userList[index].token
                });
            }
            
            res.json({
                result: "OK",
                list: list
            });
        }
    });
})

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

module.exports = router;
