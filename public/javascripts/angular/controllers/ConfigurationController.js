var app = angular.module("app");

app.controller("ConfigurationController", ['$scope', '$location', '$http', '$localStorage', 'Services', function ($scope, $location, $http, $localStorage, Services) {
    $scope.errorMsgList = [];
    
   /*
    * nota!!! no se usa
    */
    $scope.uploadImg = function() {
       
        Services.uploadImgProfile($scope.imgProfile, function(res){
            console.log("res -> "+res);
        },function(error){
            console.log("ha fallado");
        });
    }
}]);