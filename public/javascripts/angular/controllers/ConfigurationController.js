var app = angular.module("app");

app.controller("ConfigurationController", ['$scope', '$location', '$http', '$localStorage', 'UserService', function ($scope, $location, $http, $localStorage, UserService) {
    $scope.errorMsgList = [];
    
   /*
    * nota!!! no se usa
    */
    $scope.uploadImg = function() {
       
        UserService.uploadImgProfile($scope.imgProfile, function(res){
            console.log("res -> "+res);
        },function(error){
            console.log("ha fallado");
        });
    }
}]);