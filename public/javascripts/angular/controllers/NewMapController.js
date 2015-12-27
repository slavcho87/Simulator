var app = angular.module("app");

app.controller("NewMapController", ['$scope', '$http', function ($scope, $http) {
    $scope.errorMsgList = [];
    $scope.step=1;
    $scope.maximumStaticItemsToDisplay = 150;
    
    /*
     * 
     */
    $scope.setStep = function(stepNumber){
        $scope.step = stepNumber;
    }
    
    /*
     * Devuelve true si y solo si tenemos que ocultar uno de los divs en la creacion de una escena
     */
    $scope.isStepActivate = function(stepNumer){        
        return ($scope.step != stepNumer);
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
     *
     */
    $scope.loadFromFileSelected = function(){        
        return ($scope.defineForm!="loadFromFile");
    }
    
    /*
     *
     */
    $scope.setManuallySelected = function(){
        return ($scope.defineForm!="setManually");
    }
}]);