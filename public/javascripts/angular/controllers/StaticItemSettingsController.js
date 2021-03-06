var app = angular.module("app");

app.controller("StaticItemSettingsController", ['$scope', '$http', 'Services', function ($scope, $http, Services) {
    $scope.errorMsgList = [];
    $scope.msgList = [];
    $scope.staticItemList = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    
    $scope.pages = function() {
        var input = [];
        
        for (var i = 0; i < $scope.numberOfPages(); i += 1) {
            input.push(i);
        }
        
        return input;
    };

    $scope.numberOfPages=function(){
        return Math.ceil($scope.sceneList.length/$scope.pageSize);                
    }
    
    $scope.setCurrentPage = function(page){
        $scope.currentPage = page;
    }
    
    $scope.previous = function(){
        if($scope.currentPage != 0){
            $scope.currentPage=$scope.currentPage-1;
        }
    }
    
    $scope.next = function(){
        if($scope.currentPage < $scope.sceneList.length/$scope.pageSize - 1){
            $scope.currentPage=$scope.currentPage+1;
        }
    }
    
    $scope.pages = function() {
        var input = [];
        
        for (var i = 0; i < $scope.numberOfPages(); i += 1) {
            input.push(i);
        }
        
        return input;
    };

    $scope.numberOfPages=function(){
        return Math.ceil($scope.staticItemList.length/$scope.pageSize);                
    }
    
    $scope.setCurrentPage = function(page){
        $scope.currentPage = page;
    }
    
    $scope.previous = function(){
        if($scope.currentPage != 0){
            $scope.currentPage=$scope.currentPage-1;
        }
    }
    
    $scope.next = function(){
        if($scope.currentPage < $scope.staticItemList.length/$scope.pageSize - 1){
            $scope.currentPage=$scope.currentPage+1;
        }
    }
    
    $scope.saveStaticItem = function(){
        var error = false;
        
        if(!$scope.staticItem){
            $scope.errorMsgList.push("Fill the form!");
        }else{  
            if(!$scope.staticItem.name){    
                $scope.errorMsgList.push("Static item name can not be empty!");
                error = true;
            }
            
            if(!$scope.staticItem.icon){
                $scope.errorMsgList.push("Static item icon can not be empty!");
                error = true;
            }
            
            if(!error){
                $scope.staticItem.type= "static";

                Services.saveItem($scope.staticItem, function(res){
                    if(res.result == "NOK"){
                        $scope.errorMsgList.push(res.msg);
                    }else{
                        $scope.msgList.push(res.msg);

                        $scope.staticItemList.push({
                            name: $scope.staticItem.name,
                            icon: $scope.staticItem.icon,
                            type: $scope.staticItem.type
                        });

                        $scope.staticItem.name="";
                    }
                }, function(err){
                    $scope.errorMsgList.push(err);
                });    
            }            
        }
    }
    
    $scope.getStaticItemList = function(){
        Services.staticItemList(function(res){
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
        var error = false;
        
        if(!$scope.selectEditItemValue){
            $scope.errorMsgList.push("Fill the form!");
        }else{  
            if(!$scope.selectEditItemValue.name){    
                $scope.errorMsgList.push("Static item name can not be empty!");
                error = true;
            }
            
            if(!$scope.selectEditItemValue.icon){
                $scope.errorMsgList.push("Static item icon can not be empty!");
                error = true;
            }
            
            if(!error){
                Services.updateItem($scope.selectEditItemValue, function(res){
                    if(res.result=="NOK"){
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
    
    $scope.selectDeletedItem = function(staticItem){
        $scope.selectDeletedItemValue = staticItem;
    }
    
    $scope.deleteSelectedStaticItem = function(){
        Services.deleteItem($scope.selectDeletedItemValue.name, function(res){
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
    
    $scope.exit = function(){
        Services.logout();
    }    
}]).filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});