var app = angular.module("app");

app.controller("RecommenderSettingsController", ['$scope', '$http','Services', function ($scope, $http, Services) {
    $scope.errorMsgList = [];
    $scope.msgList = [];
    $scope.recommenderList = [];
    
    /*
     * Save new recommeder settings
     */
    $scope.saveRecommeder = function(){
        Services.recommenderSave($scope.rec, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                $scope.msgList.push(res.msg);
                
                //insert new recommender into the recommender list
                $scope.recommenderList.push({    
                    poolName: $scope.rec.poolName,
                    recommenderType: $scope.rec.type,
                    maximuDistanteToGo: $scope.rec.maxDistanceToGo,
                    visibilityRadius: $scope.rec.visibilityRadius,
                    itemsToRecommend: $scope.rec.numItemToRec,
                    minimumScore: $scope.rec.minScoreForRec
                });
                
                //reset object rec
                $scope.rec.poolName="";
                $scope.rec.type="";
                $scope.rec.maxDistanceToGo="";
                $scope.rec.visibilityRadius="";
                $scope.rec.numItemToRec="";
                $scope.rec.minScoreForRec="";
            }
        }, function(error){
            $scope.errorMsgList.push("ERROR: "+error);
        });
    }
    
    $scope.getRecommenderList = function(){
        Services.getRecommenderList(function(res){
            angular.forEach(res, function(value, key) {
                $scope.recommenderList.push(value);
            });
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    $scope.selectDeleteRecommender = function(recommender){
        $scope.selectDeleteRecommender = recommender;
    }
    
    $scope.deleteRecommender = function(){
       Services.deleteRecommender($scope.selectDeleteRecommender.poolName, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);    
            }else{
                $scope.msgList.push(res.msg);
                
                var index = $scope.recommenderList.indexOf($scope.selectDeleteRecommender);
                if(index>=0){
                    $scope.recommenderList.splice(index, 1);
                }
                
                $scope.selectDeleteRecommender = null;
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
}]);