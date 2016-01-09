var app = angular.module("app");

app.controller("StaticItemSettingsController", ['$scope', '$http', 'Services', function ($scope, $http, Services) {
    $scope.errorMsgList = [];
    $scope.msgList = [];
    $scope.staticItemList = [];

    $scope.saveStaticItem = function(){
        Services.saveStaticItem($scope.staticItem, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                $scope.msgList.push(res.msg);
                
                $scope.staticItemList.push({
                    name: $scope.staticItem.name,
                    icon: $scope.staticItem.icon
                });
                
                $scope.staticItem.name="";
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    $scope.getStaticItemList = function(){
        Services.getStaticItemList(function(res){
            for(index in res){
                $scope.staticItemList.push(res[index]);
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    $scope.selectEditItem = function(staticItem){
        $scope.selectEditItemValue = staticItem;
    }
    
    $scope.updateStaticItem = function(){
        Services.updateStaticItem($scope.selectEditItemValue, function(res){
            if(res.result=="NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                $scope.msgList.push(res.msg);
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });   
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
    
    $scope.selectDeletedItem = function(staticItem){
        $scope.selectDeletedItemValue = staticItem;
    }
    
    $scope.deleteSelectedStaticItem = function(){
        Services.deleteStaticItem($scope.selectDeletedItemValue.name, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);    
            }else{
                $scope.msgList.push(res.msg);
                
                var index = $scope.staticItemList.indexOf($scope.selectDeletedItemValue);
                if(index>=0){
                    $scope.staticItemList.splice(index, 1);
                }
                
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
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
}]).directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);