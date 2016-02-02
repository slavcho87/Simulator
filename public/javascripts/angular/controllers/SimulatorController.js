var app = angular.module("app");

app.controller("SimulatorController", ['$scope', '$http', 'Services', 'DataFactory', function ($scope, $http, Services, DataFactory) {
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
                        data.itemId = value._id;
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
                            
                            var overlay = new ol.Overlay({
                                position: ol.proj.transform(location, 'EPSG:4326', 'EPSG:3857'),
                                element: $('<img src="'+value.itemType.icon+'" class="img-circle">')
                                .css({marginTop: '-50%', marginLeft: '-50%', width: '32px', height: '32px', cursor: 'pointer'})        
                            });
                            
                            map.addOverlay(overlay);
                            
                            var info = {
                                overlay: overlay,
                                speed: speed,
                                route: res.route,
                                course: course,
                                icon: value.itemType.icon
                            };
                            
                            $scope.dynamiItemsList.push(info);
                        }, function(err){
                            $scope.errorMsgList.push("The dynamic objects could not be saved!");
                            $scope.errorMsgList.push(err);
                        });
                    }else if(value.itemType.type=="static"){
                        var location = [parseFloat(value.location.latitude), parseFloat(value.location.longitude)];

                        var overlay = new ol.Overlay({
                            position: ol.proj.transform(location, 'EPSG:4326', 'EPSG:3857'),
                            element: $('<img src="'+value.itemType.icon+'" class="img-circle">')
                            .css({marginTop: '-50%', marginLeft: '-50%', width: '32px', height: '32px', cursor: 'pointer'})        
                        });

                        map.addOverlay(overlay);
                    }
                });
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
        
        $scope.hideLoadBar = true;
        $scope.simulationDataLoaded = true; 
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
    $scope.msgHide = function(msg){
        var msgIndex = $scope.errorMsgList.indexOf(msg);
        
        if(msgIndex>=0){
            $scope.errorMsgList.splice(msgIndex, 1);
        }else{
            $scope.errorMsgList.push(ERROR_HAS_OCCURRED);
        }
    }
    
    /*
    * Return true if and only if the bar list have got elements
    */    
    $scope.barListShow = function(){
        return $scope.barList.length>0;
    }    
}]);