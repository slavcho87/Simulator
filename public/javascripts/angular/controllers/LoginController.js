var app = angular.module("app");

app.controller("LoginController", ['$scope', '$location', '$http', '$localStorage', 'Services', function ($scope, $location, $http, $localStorage, Services) {
    $scope.errorMsgList = [];
    
    $scope.loginForm = {
        userName: "",
        pass: ""
    };
    
    /**
     * Login service
     */
    $scope.login = function() {
        Services.login($scope.loginForm, function(res){
            if(res.type == false){
                $scope.errorMsgList.push(res.data);
            }else{
                $localStorage.token = res.data.token;
                $location.path('/map');    
            }
        },function(error){
            $scope.errorMsgList.push("Authentication fail!");
        });
    }
    
    /*
     * Hide error message
     */    
    $scope.errorMsgHide = function(msg) {
        var msgIndex = $scope.errorMsgList.indexOf(msg);
        
        if(msgIndex>=0){
            $scope.errorMsgList.splice(msgIndex, 1);
        }else{
            $scope.errorMsgList.push("Ha ocurrido un error");
        }
    }
    

}])