var app = angular.module("app");

app.controller("SimulatorController", ['$scope', '$http', 'Services', 'DataFactory', function ($scope, $http, Services, DataFactory) {
    $scope.errorMsgList = [];
    $scope.userImg;
    $scope.simulationDataLoaded = false;
    $scope.info = "";
    $scope.msg = DataFactory.data.msg;
    
    $scope.getUserImg = function(){
            Services.getUserImg(function(res){
                if(res.result=="NOK"){
                    $scope.errorMsgList.push(res.msg);    
                }else{
                    $scope.userImg = res.img;
                }
            }, function(err){
                $scope.errorMsgList.push(err);
            });
    }
    
    $scope.getUser = function(){
        return Services.getUser();
    }
    
    $scope.loadData = function(){
        //load user image
        $scope.info = "Loading user image ...";
        Services.getUserImg(function(res){
            if(res.result=="NOK"){
                $scope.errorMsgList.push(res.msg);    
            }else{
                $scope.userImg = res.img;
            }
        }, function(err){
            $scope.errorMsgList.push(err);   
        });
        
        $scope.info = "Loading static items ...";
        //load static ites
        
        
        $scope.info = "Loading dynamic items ...";
        //load dynamic items
        
        $scope.simulationDataLoaded = true; 
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
    * Return true if and only if the bar list have got elements
    */    
    $scope.barListShow = function(){
        return $scope.barList.length>0;
    }    
}]);