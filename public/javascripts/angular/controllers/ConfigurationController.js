var app = angular.module("app");

app.controller("ConfigurationController", ['$scope', '$location', '$http', '$localStorage', 'Services', function ($scope, $location, $http, $localStorage, Services) {
    $scope.errorMsgList = [];
    $scope.msgList = [];
    
    $scope.updatePassword = function(){
        var error = false;
        
        if(!$scope.password){
            $scope.errorMsgList.push("Fill out the form passwords");
        }else{
            if(!$scope.password.newPass){
                $scope.errorMsgList.push("The new password can not be empty!");
                error = true;
            }
            
            if(!error){
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
        }
    }
    
    $scope.updateUserName = function(){
        var error = false;
        
        if(!$scope.userName){
            $scope.errorMsgList.push("Fill out the form usernames");
        }else{
            if(!$scope.userName.newUserName){
                $scope.errorMsgList.push("The new user name can not be empty!");
                error = true;
            }
            
            if(!error){
                if($scope.userName.newUserName != $scope.userName.repatNewUserName){
                    $scope.errorMsgList.push("New user names do not match");
                }else{
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
            }
        }
    }
    
    $scope.updateImgPerfil = function(){
        var error = false;
        
        if(!$scope.updateImgPerfilValue){
            $scope.errorMsgList.push("The image can not be empty");
            error = true;
        }
        
        if(!error){
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