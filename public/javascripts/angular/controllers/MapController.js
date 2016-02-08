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
        if($scope.findMap.startDate && !$scope.findMap.endDate){
            $scope.findMap.endDate = formattedDate(new Date());
        }
        
        if($scope.findMap.startDate > $scope.findMap.endDate){
            $scope.errorMsgList.push("La fecha de inicio no puede ser mayor que la fecha fin");
        }else{
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
    }
    
    function formattedDate(date) {
        var d = new Date(date || Date.now()),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
    
    $scope.formattDDmmYYY = function(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [month, day, year].join('/');
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