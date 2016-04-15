var app = angular.module('app');

app.controller("SimulatorController", ['$scope', '$timeout', '$http', '$localStorage', 'Services', 'DataFactory', function ($scope, $timeout, $http, $localStorage, Services, DataFactory) {
    $scope.errorMsgList = [];
    $scope.userImg;
    $scope.simulationDataLoaded = false;
    $scope.hideLoadBar = true;
    $scope.info = "";
    $scope.mapId = DataFactory.data.mapId;
    $scope.sceneList = [];
    $scope.sceneListEmpty = false;
    $scope.mapCenter = [0, 0];
    $scope.staticItemList = [];
    $scope.dynamiItemsList = [];
    $scope.dynamiItemsListOriginal = [];
    $scope.recommendedItemList = [];
    $scope.itemTypeList = [];
    $scope.itemTypesToRecommend = [];
    $scope.showPlay = true;
    $scope.token = $localStorage.token;
    $scope.resultTypeShow = "emptyList";
    $scope.percentage = "0%";
    $scope.percentageSum = 0;
    $scope.userMovement = "simuledMovement";
    
    $scope.recomend = function(){
        $scope.recommendedItemList = [];
        
        var data = {
            strategyType: $scope.recommender.strategyType,
            mapId: $scope.selectedScene.mapId,
            sceneId: $scope.selectedScene._id,
            token: $scope.token,
            recommender: $scope.recommender._id,
            itemTypesToRecommend: $scope.itemTypesToRecommend,
            resultTypeShow: $scope.resultTypeShow
        };
        
        var index = map.getOverlays().getArray().indexOf(overlayList['user']);
                                
        if(index>=0){
            var location = map.getOverlays().getArray()[index].getPosition();
            location = ol.proj.transform(location, 'EPSG:3857', 'EPSG:4326');
            
            var loc = {
                latitude: location[0],
                longitude: location[1]
            };
            
            data.location = loc;
            socket.emit('getRecommend', data);
        }else{
            $scope.errorMsgList.push("The user's location can not be empty!");
        }
    }
    
    $scope.setRating = function(itemId, rating, valueForecast){
        var data = {
            userId: $scope.token,
            strategyType: $scope.recommender.strategyType,
            mapId: $scope.selectedScene.mapId,
            sceneId: $scope.selectedScene._id,
            rating: rating,
            itemId: itemId,
            recommenderId: $scope.recommender._id
        };
        
         var index = map.getOverlays().getArray().indexOf(overlayList['user']);
                                
        if(index>=0){
            var location = map.getOverlays().getArray()[index].getPosition();
            location = ol.proj.transform(location, 'EPSG:3857', 'EPSG:4326');
            
            var loc = {
                latitude: location[0],
                longitude: location[1]
            };
            
            data.location = loc; console.log(data);
            socket.emit('get value forecast', data);
        }else{
            $scope.errorMsgList.push("The user's location can not be empty!");
        }
    }
    
    $scope.setRatingWithForecas = function(itemId, rating, valueForecast){
        var data = {
            rating: rating,
            valueForecast: valueForecast,
            itemId: itemId,
            recommenderId: $scope.recommender._id
        };
        
        Services.setRating(data, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    $scope.assignRating = function(data){
        Services.setRating(data, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    $scope.getUserImg = function(){
            Services.getUserImg(function(res){
                if(res.result=="NOK"){
                    $scope.errorMsgList.push(res.msg);    
                }else{
                    $scope.userImg = res.img;
                }
            }, function(err){
                $scope.errorMsgList.push(err);
            });
    }
    
    $scope.getUser = function(){
        return Services.getUser();
    }
    
    $scope.getSceneList = function(){
        Services.findSceneListFromMapId($scope.mapId, function(res){
            if(res.result=="NOK"){
                $scope.errorMsgList.push(res.msg);
                $scope.sceneListEmpty = true;
            }else{
                if(res.sceneList.length == 0){
                    $scope.sceneListEmpty = true;
                }
                
                angular.forEach(res.sceneList, function(value, key) {
                    $scope.sceneList.push(value);
                });
            }
        }, function(err){
            $scope.errorMsgList.push(err);
            $scope.sceneListEmpty = true;
        });
    }
    
    $scope.loadData = function(){    
        $scope.sceneList = [];
        $scope.hideLoadBar = false;
        
        $scope.info = "Loading ...";
        Services.getUserImg(function(res){
            if(res.result=="NOK"){
                $scope.errorMsgList.push(res.msg);    
            }else{
                $scope.userImg = res.img;
                
                $scope.percentageSum+=20;
                $scope.percentage=String($scope.percentageSum)+"%";
                
                if($scope.percentageSum==100){
                    $scope.hideLoadBar = $scope.hideLoadBar || true;
                    $scope.simulationDataLoaded = $scope.simulationDataLoaded || true;
                }
            }
        }, function(err){
            $scope.errorMsgList.push(err);   
        });
        
        $scope.selectedScene = JSON.parse($scope.selectedScene);
        var lat = ($scope.selectedScene.latitudeLRC + $scope.selectedScene.latitudeULC)/2;
        var long = ($scope.selectedScene.longitudeLRC + $scope.selectedScene.longitudeULC)/2;
        map.setView(new ol.View({
            center: ol.proj.transform([lat, long], 'EPSG:4326', 'EPSG:3857'),                     
            zoom: 15           
        }));
        
        //load static ites
        var data = {
            sceneId: $scope.selectedScene._id, 
            mapId: $scope.selectedScene.mapId
        };
        
        Services.getItemList(data, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                angular.forEach(res.staticItemList, function(value, key) {
                    if(value.itemType.type=="dynamic"){
                        var data2 = {
                            sceneId: data.sceneId, 
                            mapId: data.mapId,
                            itemId: value._id
                        };
                        
                        getDynamicItems(value, data2);
                    }else if(value.itemType.type=="static"){
                        var location = [parseFloat(value.location.latitude), parseFloat(value.location.longitude)];
                        
                        if(!value.description){
                            value.description = "";
                        }

                        var id='\''+value._id+'\'';
                        var overlay = new ol.Overlay({
                            position: ol.proj.transform(location, 'EPSG:4326', 'EPSG:3857'),
                            element: $('<img src="'+value.itemType.icon+'" class="img-circle">')
                            .css({marginTop: '-50%', marginLeft: '-50%', width: '32px', height: '32px', cursor: 'pointer'})
                            .tooltip({title: '<label style=\"text-align: left\">Name: </labe><label>'+value.itemName+'</label><br/><label>Description: </label><label>'+value.description+'</label><br/><label>Rating: </label><select style=\"background-color: black\" id='+id+' onchange="setRating('+id+')"><option value="0"></option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select>', trigger: 'click', html: true})
                        });

                        map.addOverlay(overlay);
                    }
                });
              
                $timeout(function() {
                    $scope.percentageSum+=20;
                    $scope.percentage=String($scope.percentageSum)+"%";

                    if($scope.percentageSum==100){
                        $scope.hideLoadBar = $scope.hideLoadBar || true;
                        $scope.simulationDataLoaded = $scope.simulationDataLoaded || true; 
                    }
                    
                    socket.emit('sincronize map', data);
                }, 3000);
                
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
        
        Services.staticItemList(function(res){
            for(index in res){
                var item = {
                    _id: res[index]._id,
                    name: res[index].name
                };

                $scope.itemTypeList.push(item);      
            }
            
            $scope.percentageSum+=20;  
            $scope.percentage=String($scope.percentageSum)+"%";
            
            if($scope.percentageSum==100){
                $scope.hideLoadBar = $scope.hideLoadBar || true;
                $scope.simulationDataLoaded = $scope.simulationDataLoaded || true; 
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
        
        Services.dynamicItemList(function(res){
            for(index in res){
                var item = {
                    _id: res[index]._id,
                    name: res[index].name
                };

                $scope.itemTypeList.push(item);  
            }
            
            $scope.percentageSum+=20;  
            $scope.percentage=String($scope.percentageSum)+"%";
            
            if($scope.percentageSum==100){
                $scope.hideLoadBar = $scope.hideLoadBar || true;
                $scope.simulationDataLoaded = $scope.simulationDataLoaded || true; 
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
        
        Services.searchRecommenderById($scope.selectedScene.recommender, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);    
            }else{
                $scope.recommender = res.recommender;
                
                $scope.percentageSum+=20;
                $scope.percentage=String($scope.percentageSum)+"%";
                
                if($scope.percentageSum==100){
                    $scope.hideLoadBar = $scope.hideLoadBar || true;
                    $scope.simulationDataLoaded = $scope.simulationDataLoaded || true; 
                }
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    function getDynamicItems(value, data){
        Services.dynamicItemRoute(data, function(res){
            res.route.sort(function(a, b){
                return a.routeId.routePos-b.routeId.routePos;
            });
            
            //calculamos el rumbo
            var course = [];
            for(index=0; index<res.route.length-1; index++){
                var lon1 = parseFloat(res.route[index].routeId.longitude);
                var lon2 = parseFloat(res.route[index+1].routeId.longitude);
                var lat1 = parseFloat(res.route[index].routeId.latitude);
                var lat2 = parseFloat(res.route[index+1].routeId.latitude);    
                
                var r = bearing(lon1, lat1, lon2, lat2);
                course.push(r);    
            }
            
            var speed = res.route[0].routeId.speed;
            
            var location = [parseFloat(res.route[0].routeId.latitude),
                            parseFloat(res.route[0].routeId.longitude)];
            
            var id='\''+value._id+'\'';
            
            if(!value.description){
                value.description = "";
            }
            
            var overlay = new ol.Overlay({
                position: ol.proj.transform(location, 'EPSG:4326', 'EPSG:3857'),
                element: $('<img src="'+value.itemType.icon+'">')
                .css({marginTop: '-50%', marginLeft: '-50%', width: '16px', height: '16px', cursor: 'pointer'})
                .tooltip({title: '<label style=\"text-align: left\">Name: </labe><label>'+value.itemName+'</label><br/><label>Description: </label><label>'+value.description+'</label><br/><label>Rating: </label><select style=\"background-color: black\" id='+id+' onchange="setRating('+id+')"><option value="0"></option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select>', trigger: 'click', html: true})
            });
                            
            map.addOverlay(overlay);
                            
            var info = {
                _id: res._id,
                overlay: overlay,
                speed: speed,
                route: res.route,
                course: course,
                icon: value.itemType.icon    
            };
            
            var info2 = {
                _id: res._id,
                overlay: overlay,
                speed: speed,
                route: res.route,
                course: course,
                icon: value.itemType.icon    
            };
            
            $scope.dynamiItemsList.push(info);
            $scope.dynamiItemsListOriginal.push(info2);
        }, function(err){
            $scope.errorMsgList.push("The dynamic objects could not be saved!");
            $scope.errorMsgList.push(err);
        }); 
    }
    
    //Calculo de rumbo entre dos coordenadas geograficas
    function bearing(lon1, lat1, lon2, lat2){
        var incL = lon2 - lon1;
    
        //Resolver rumbos 0 y 180
        if(incL == 0.0){
            if(lat1<lat2){
                return 0.0;
            }else if(lat1>lat2){
                return 180.0;
            }else{
                return 0.0;
            }
        }
        
        //Resolver rumbos 90 y 270
        var incLat = lat2 - lat1;
        if(incLat == 0.0){
            if(lon1<lon2){
                return 90.0;
            }else if(lon1>lon2){
                return 270.0;
            }else{
                return 0.0;
            }
        }
        
        var incLonRadians = (lon2 - lon1) * Math.PI / 180.0;
        var incLatRadians = (lat2 - lat1) * Math.PI / 180.0;
        var lm = (lat1 + lat2) / 2.0;
        var lmRadians = lm * Math.PI / 180.0;
        var coslm = Math.cos(lmRadians);
        var apRadians = incLonRadians * Math.abs(coslm);
        var tanR = apRadians / incLatRadians;
        var rRadians = Math.atan(tanR);
        var r = rRadians * 180.0 / Math.PI;
        
        if(r > 0){
            if(apRadians < 0){
                //tercer cuadrante
                r = 180.0 + r;
            }
        }else{
            if(apRadians > 0){
                //segundo cuadrante
                r = 180.0 + r;
            }else{
                //cuarto cuadrante
                r = 360.0 + r;
            }
        }
        
        return r;
    }

    /*
    * Hide error message
    */    
    $scope.msgHide = function(msg){console.log("");
        var msgIndex = $scope.errorMsgList.indexOf(msg);
        
        if(msgIndex>=0){
            $scope.errorMsgList.splice(msgIndex, 1);
        }else{
            $scope.errorMsgList.push(ERROR_HAS_OCCURRED);
        }
    }
    
    $scope.userMove = function(){
        var index = map.getOverlays().getArray().indexOf(overlayList['user']);
                                
        if(index>=0){
            var location = map.getOverlays().getArray()[index].getPosition();
            location = ol.proj.transform(location, 'EPSG:3857', 'EPSG:4326');
            
            var loc = {
                latitude: location[0],
                longitude: location[1]
            };
        }
        
        var data = {
            sceneId: $scope.selectedScene._id, 
            mapId: $scope.selectedScene.mapId,
            location: loc
        };
        
        Services.userMove(data, function(err){
            $scope.errorMsgList.push();
        });
    }
    
    /*
    * Return true if and only if the bar list have got elements
    */    
    $scope.barListShow = function(){
        return $scope.barList.length>0;
    }
    
    $scope.exit = function(){
        Services.logout();
    }
}]);