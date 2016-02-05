var app = angular.module("app");

app.controller("MapController", ['$scope', '$http', '$location', 'Services', 'DataFactory', function ($scope, $http, $location, Services, DataFactory) {
    $scope.errorMsgList = [];
    $scope.msgList = [];
    $scope.mapList = [];
    $scope.findMap = {};
    
    $scope.map = {
        name: "", 
        type: "", 
        zoomLevel: 15,
        city: "",
        mapCenterLong: "",
        mapCenterLat: ""
    };
    
    $scope.startSimulation = function(id){
        DataFactory.data.mapId = id;
        window.location = '#/simulator';
    }
    
    $scope.findMaps = function(){
        $scope.mapList = [];
        Services.findMaps($scope.findMap, function(res){
            if(res.result=="NOK"){
                $scope.errorMsgList.push(res.msg);    
            }else{
                if(res.mapList.length==0){
                    $scope.msgList.push("The search returned 0 results");
                }
                
                angular.forEach(res.mapList, function(value, key) {
                    $scope.mapList.push(value);
                });
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    $scope.selectMapToDelete = function(map){
        $scope.selectMapToDeleteValue = map;
    }
    
    $scope.deleteMap = function(){
        Services.deleteMap($scope.selectMapToDeleteValue._id, function(res){
            if(res.result=="NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                $scope.msgList.push(res.msg);
                
                var index = $scope.mapList.indexOf($scope.selectMapToDeleteValue);
                if(index>=0){
                    $scope.mapList.splice(index, 1)
                }
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    $scope.editMap = function(map){
        DataFactory.data.mapId = map._id;
        window.location = '#/map/editMap';
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
     *
     */
    $scope.msgSuccessHide = function(msg){
        var msgIndex = $scope.msgList.indexOf(msg);
        
        if(msgIndex>=0){
            $scope.msgList.splice(msgIndex, 1);
        }else{
            $scope.msgList.push(ERROR_HAS_OCCURRED);
        }            
    }
}]);