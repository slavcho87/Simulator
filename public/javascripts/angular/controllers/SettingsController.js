var app = angular.module("app");

app.controller("SettingsController", ['$scope', '$http', function ($scope, $http) {
    $scope.errorMsgList = [];
    $scope.barList = [];
    $scope.bar = {
        id: "",
        name: "",
        address: "",
        telephone: ""
    };
    
   /*
    * Insert new bar
    */
    $scope.addBar = function() {
        var error = false;
        
        if($scope.bar.name == ""){
            $scope.errorMsgList.push(BAR_NAME_NULL);
            error = true;
        }

        if(!error){
            $http.post(BASE_DIR+BAR_SERVICE+ADD_BAR, $scope.bar).
            success(function(data) {                
                $scope.barList.push({
                    id: data, 
                    name: $scope.bar.name, 
                    address: $scope.bar.address, 
                    telephone: $scope.bar.telephone
                });                    
                    
                $scope.bar.id = "";
                $scope.bar.name = "";
                $scope.bar.address = "";
                $scope.bar.telephone = "";
            }).
            error(function(data, status) {
                $scope.errorMsgList.push(BAR_NOT_INSERTED);
            });
        }
    }

   /*
    * Search all bar from the data base
    */    
    $scope.searchAllBars = function () {
        $http.get(BASE_DIR+BAR_SERVICE+SEARCH_ALL_BARS).
        success(function(data) {
            $scope.barList = [];
            
            angular.forEach(data, function(value, key) {
                $scope.barList.push(value);
            });
        }).
        error(function(data) {
            $scope.errorMsgList.push(BAR_LIST_NOT_FOUND);
        });
    }
    
   /*
    * Delete one bar from the data base
    */    
    $scope.deleteBar = function (bar) {
        var barIndex = $scope.barList.indexOf(bar);
        
        if(barIndex>=0){
            $http.delete(BASE_DIR+BAR_SERVICE+DELETE_BAR_BY_ID+bar.id).
            success(function(data, status) {
                $scope.barList.splice(barIndex, 1);
            }).
            error(function(data, status) {
                $scope.errorMsgList.push(BAR_NOT_DELETED);
            });
        }else{
            $scope.errorMsgList.push(ERROR_HAS_OCCURRED);
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
    
   /*
    * Return true if and only if the bar list have got elements
    */    
    $scope.barListShow = function(){
        return $scope.barList.length>0;
    }    
}]);