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
        //por aqui tenemos que pasar todos los datos al siguiente controlador
        //$("#startSimulationModal").modal('hide');
        //$location.url('/simulator');
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