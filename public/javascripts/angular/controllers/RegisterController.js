var app = angular.module("app");

app.controller("RegisterController", ['$scope', '$location', '$http', '$localStorage', 'UserService', function ($scope, $location, $http, $localStorage, UserService) {
    $scope.errorMsgList = [];
    $scope.successMsgList = [];

    $scope.registerForm = {
        userName: "",
        pass: "",
        repeatPass: ""
    };
    
    /**
     * Register new user
     */
    $scope.register = function() {
        var error = false;
        
        if($scope.registerForm.pass!=$scope.registerForm.repeatPass){
            error = true;
             $scope.errorMsgList.push("Password not equals");
        }
        
        if(!error){
            UserService.save($scope.registerForm, function(res){ 
                if (res.type == false) {
                    $scope.errorMsgList.push(res.data);
                } else {
                    $localStorage.token = res.data.token;
                    $scope.successMsgList.push("User has been created. Please login!");  
                }
            },function(error){
                $scope.errorMsgList.push(error);
            });
        }
    }   
    
    /**
     * redirecto to the login page
     */
    $scope.goToLogin = function(msg) {
        $location.path('/');
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
    
    /*
     * Hide success message
     */    
    $scope.successMsgHide = function(msg) {
        var msgIndex = $scope.successMsgList.indexOf(msg);
        
        if(msgIndex>=0){
            $scope.successMsgList.splice(msgIndex, 1);
        }else{
            $scope.successMsgList.push("Ha ocurrido un error");
        }
    }    
}]);