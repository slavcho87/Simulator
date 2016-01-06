var app = angular.module("app");

app.controller("NewMapController", ['$scope', '$http', '$localStorage', 'Services', function ($scope, $http, $localStorage, Services) {
    $scope.errorMsgList = [];
    $scope.msgList = [];
    $scope.step=1;
    $scope.cityList = [];
    $scope.hideScene = true;
    
    $scope.mapSave = function(){
        Services.mapSave($scope.map, function(res){
            if(res.result == "OK"){
                $scope.msgList.push(res.msg);
                $scope.hideScene = false;
            }else{
                $scope.errorMsgList.push(res.msg);    
            }
        },function(error){
            $scope.errorMsgList.push(error);
        });
    }
    
    $scope.citySearch = function(){
        if(!$scope.citySearchValue || 0 === $scope.citySearchValue.length){
            $scope.errorMsgList.push("Insert city name!");
        }else{
            Services.citySearch($scope.citySearchValue, function(res){
                $scope.cityList = res; 
            },function(error){
               $scope.errorMsgList.push("Error: "+error);
            });        
        }
    }

    /*
     * 
     */
    $scope.setStep = function(stepNumber){
        $scope.step = stepNumber;
        
        staticItemsMap.getView().setCenter(limitMap.getView().getCenter());
        staticItemsMap.getView().setZoom(limitMap.getView().getZoom());

        dynamicItemsMap.getView().setCenter(limitMap.getView().getCenter());
        dynamicItemsMap.getView().setZoom(limitMap.getView().getZoom());
    }
    
    /*
     * Devuelve true si y solo si tenemos que ocultar uno de los divs en la creacion de una escena
     */
    $scope.isStepActivate = function(stepNumer){        
        return ($scope.step != stepNumer);
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
    * Hide message
    */    
    $scope.msgSuccessHide = function(msg){
        var msgIndex = $scope.msgList.indexOf(msg);
        
        if(msgIndex>=0){
            $scope.msgList.splice(msgIndex, 1);
        }else{
            $scope.msgList.push(ERROR_HAS_OCCURRED);
        }
    }
    
    /*
     *
     */
    $scope.loadFromFileSelected = function(){        
        return ($scope.defineForm!="loadFromFile");
    }
    
    /*
     *
     */
    $scope.loadFromFileSelectedDynamicItem = function(){
        return ($scope.defineFormFileDynamicItem!="loadFromFileDynamicItem");
    }
    
    /*
     *
     */
    $scope.setManuallySelected = function(){
        return ($scope.defineForm!="setManually");
    }
    
    /*
     *
     */
    $scope.setManuallySelectedDynamicItem = function(){
        return ($scope.defineFormFileDynamicItem!="setManuallyDynamicItem");
    }
}]);