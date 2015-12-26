var app = angular.module("app");

app.controller("RecommenderSettingsController", ['$scope', '$http', function ($scope, $http) {
    $scope.errorMsgList = [];
    
   /*
    * Delete one bar from the data base
    */    
    $scope.deleteBar = function (bar) {
        var barIndex = $scope.barList.indexOf(bar);
        
        if(barIndex>=0){
            $http.delete(BASE_DIR+BAR_SERVICE+DELETE_BAR_BY_ID+bar.id).
            success(function(data, status) {
                $scope.barList.splice(barIndex, 1);
            }).
            error(function(data, status) {
                $scope.errorMsgList.push(BAR_NOT_DELETED);
            });
        }else{
            $scope.errorMsgList.push(ERROR_HAS_OCCURRED);
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
}]);