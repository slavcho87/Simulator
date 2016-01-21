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
        console.log($scope.selectedScene);
        
        //load dynamic items
        
        $scope.hideLoadBar = true;
        $scope.simulationDataLoaded = true; 
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