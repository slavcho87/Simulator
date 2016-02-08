var app = angular.module("app");

app.controller("DymanicItemSettingsController", ['$scope', '$http', 'Services', function ($scope, $http, Services) {
    $scope.errorMsgList = [];
    $scope.msgList = [];
    $scope.dynamicItemList = [];
    
    $scope.saveDynamicItem = function(){
        var error = false;
        
        if(!$scope.dynamicItem){
            $scope.errorMsgList.push("Fill the form!");
        }else{  
            if(!$scope.dynamicItem.name){    
                $scope.errorMsgList.push("Dynamic item name can not be empty!");
                error = true;
            }
            
            if(!$scope.dynamicItem.icon){
                $scope.errorMsgList.push("Dynamic item icon can not be empty!");
                error = true;
            }
            
            if(!error){
                $scope.dynamicItem.type = "dynamic";
        
                Services.saveItem($scope.dynamicItem, function(res){
                    if(res.result == "NOK"){
                        $scope.errorMsgList.push(res.msg);
                    }else{
                        $scope.msgList.push(res.msg);

                        $scope.dynamicItemList.push({
                            name: $scope.dynamicItem.name,
                            icon: $scope.dynamicItem.icon,
                            type: $scope.dynamicItem.type
                        });

                        $scope.dynamicItem.name = "";
                    }
                }, function(err){
                    $scope.errorMsgList.push(err);
                });
            }
        }
    }

    $scope.getDynamicItemList = function(){
        Services.dynamicItemList(function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                for(index in res){
                    $scope.dynamicItemList.push(res[index]);
                }
            }                  
        }, function(err){
            $scope.errorMsgList.push(err);
        });                      
    }
    
    $scope.selectEditDynamicItem = function(item){
        $scope.selectEditDynamicItemValue = item;
    }
    
    $scope.selectDeleteItem = function(item){
        $scope.selectDeleteItemValue = item;
    }
    
    $scope.deleteDynamicItem = function(){
         Services.deleteItem($scope.selectDeleteItemValue.name, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                $scope.msgList.push(res.msg);
                
                var index = $scope.dynamicItemList.indexOf($scope.selectDeleteItemValue);
                if(index>=0){
                    $scope.dynamicItemList.splice(index, 1);
                }
            }
         }, function(err){
            $scope.errorMsgList.push(err);
         });
    }
    
    $scope.updateDynamicItem = function(){
        var error = false;
        
        if(!$scope.selectEditDynamicItemValue){
            $scope.errorMsgList.push("Fill the form!");
        }else{  
            if(!$scope.selectEditDynamicItemValue.name){    
                $scope.errorMsgList.push("Dynamic item name can not be empty!");
                error = true;
            }
            
            if(!$scope.selectEditDynamicItemValue.icon){
                $scope.errorMsgList.push("Dynamic item icon can not be empty!");
                error = true;
            }
            
            if(!error){        
                Services.updateItem($scope.selectEditDynamicItemValue, function(res){
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
    
    $scope.exit = function(){
        Services.logout();
    }    
}]);