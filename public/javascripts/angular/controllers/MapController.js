var app = angular.module("app");

app.controller("MapController", ['$scope', '$http', function ($scope, $http) {
    $scope.errorMsgList = [];
    
    $scope.map = {
        name: "", 
        type: "", 
        zoomLevel: 15,
        city: "",
        mapCenterLong: "",
        mapCenterLat: ""
    };
    
   /*
    * Insert new map
    */
    $scope.addMap = function() {
        //insertar codigo para la creacion del nuevo mapa    
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
}]);