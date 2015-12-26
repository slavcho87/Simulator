var app = angular.module("app");

app.controller("StaticItemSettingsController", ['$scope', '$http', function ($scope, $http) {
    $scope.errorMsgList = [];
    


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