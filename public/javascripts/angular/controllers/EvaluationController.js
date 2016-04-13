var app = angular.module("app");

app.controller("EvaluationController", ['$scope','Services', function ($scope, Services) {
    $scope.errorMsgList = [];
    $scope.msgList = [];
    $scope.mapList = [];
    $scope.sceneList = [];
    $scope.selectedMap;
    $scope.selectedScene;
    $scope.selectedItems;
    $scope.staticItemList = [];
    
    $scope.getMapList = function(){
        Services.mapList(function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                for(index in res.list){
                    var map = {
                        _id: res.list[index]._id,
                        name: res.list[index].name
                    };
                    
                    $scope.mapList.push(map);
                }
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
        
         //load static items
        Services.staticItemList(function(res){
           for(index in res){
                $scope.staticItemList.push(res[index]);
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    $scope.getSceneListFromMapId = function(map){
        Services.findSceneListFromMapId($scope.selectedMap._id, function(res){
            if(res.result=="NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                angular.forEach(res.sceneList, function(value, key) {
                    $scope.sceneList.push(value);
                });
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    $scope.loadGraphics = function(){
        var data = {
            map: $scope.selectedMap._id,
            scene: $scope.selectedScene._id
        }
        
        for(index in $scope.selectedItems){
            data.staticItem = $scope.selectedItems[index]._id;
        }
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