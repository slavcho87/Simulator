var app = angular.module("app");

app.controller("ConfigurationController", ['$scope', '$location', '$http', '$localStorage', 'Services', function ($scope, $location, $http, $localStorage, Services) {
    $scope.errorMsgList = [];
    $scope.msgList = [];
    
    $scope.updatePassword = function(){
        if($scope.password.newPassRepeat != $scope.password.newPass){
            $scope.errorMsgList.push("New passwords do not match!");
        }else{
            Services.updatePassword($scope.password, function(res){
                if(res.result == "NOK"){
                    $scope.errorMsgList.push(res.msg);
                }else{
                    console.log(res.token);
                    $localStorage.token = res.token;
                    $scope.msgList.push(res.msg);
                    
                    $scope.password.currentPass="";
                    $scope.password.newPass="";
                    $scope.password.newPassRepeat="";
                }
            },function(err){
                $scope.errorMsgList.push(err);
            });            
        }
    }
    
    $scope.updateUserName = function(){
        Services.updateUserName($scope.userName, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                $localStorage.token = res.token;
                $scope.msgList.push(res.msg);
                
                $scope.userName.newUserName="";
                $scope.userName.repatNewUserName="";
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    $scope.updateImgPerfil = function(){
        Services.uploadImgProfile($scope.updateImgPerfilValue, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);    
            }else{
                $scope.msgList.push(res.msg);    
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    
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