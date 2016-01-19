var app = angular.module("app");

app.controller("MapController", ['$scope', '$http', '$location', 'DataFactory', function ($scope, $http, $location, DataFactory) {
    $scope.errorMsgList = [];
    
    $scope.map = {
        name: "", 
        type: "", 
        zoomLevel: 15,
        city: "",
        mapCenterLong: "",
        mapCenterLat: ""
    };
    
    $scope.startSimulation = function(){
        DataFactory.data.msg = "Esto es una prueba";
        $location.url('/simulator');
    }
    
   /*
    * Insert new map
    */
    $scope.addMap = function() {
        //insertar codigo para la creacion del nuevo mapa    
    }
    
    /*
    * Insert new map
    */
    $scope.searchMap = function() {
            
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