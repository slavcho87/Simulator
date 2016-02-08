var app = angular.module("app");

app.controller("RecommenderSettingsController", ['$scope', '$http','Services', function ($scope, $http, Services) {
    $scope.errorMsgList = [];
    $scope.msgList = [];
    $scope.recommenderList = [];
    
    /*
     * Save new recommeder settings
     */
    $scope.saveRecommeder = function(){
        var error = false;
        
        if(!$scope.rec){
            $scope.errorMsgList.push("Fill the form!");
        }else{
            if(!$scope.rec.poolName){
                $scope.errorMsgList.push("The pool name can not be empty!");
                error = true;
            }
            
            if(!$scope.rec.type){
                $scope.errorMsgList.push("The recommender type can not be empty!");
                error = true;
            }
            
            if(!$scope.rec.maxDistanceToGo){
                $scope.errorMsgList.push("The maximum distance to go can not be empty!");
                error = true;
            }
            
            if(!$scope.rec.visibilityRadius){
                $scope.errorMsgList.push("The visibility radius can not be empty!");
                error = true;
            }
            
            if(!$scope.rec.numItemToRecs){
                $scope.errorMsgList.push("The number of items to recommend can not be empty!");
                error = true;
            }
            
            if(!$scope.rec.minScoreForRec){
                $scope.errorMsgList.push("The minimum score for recommending an item can not be empty!");
                error = true;
            }
            
            if(!error){
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
        }
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
        $scope.selectDeleteRecommenderValue = recommender;
    }
    
    $scope.selectEditRecommender = function(recommender){
        $scope.selectEditRecommenderValue = recommender;
    }
    
    $scope.deleteRecommender = function(){
       Services.deleteRecommender($scope.selectDeleteRecommenderValue.poolName, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);    
            }else{
                $scope.msgList.push(res.msg);
                
                var index = $scope.recommenderList.indexOf($scope.selectDeleteRecommenderValue);
                if(index>=0){
                    $scope.recommenderList.splice(index, 1);
                }
            }
       }, function(err){
            $scope.errorMsgList.push(err);
       });
    }
    
    $scope.saveEditRecommender = function(){
        var error = false;
        
        if(!$scope.selectEditRecommenderValue){
            $scope.errorMsgList.push("Fill the form!");
        }else{
            if(!$scope.selectEditRecommenderValue.poolName){
                $scope.errorMsgList.push("The pool name can not be empty!");
                error = true;
            }
            
            if(!$scope.selectEditRecommenderValue.recommenderType){
                $scope.errorMsgList.push("The recommender type can not be empty!");
                error = true;
            }
            
            if(!$scope.selectEditRecommenderValue.maximuDistanteToGo){
                $scope.errorMsgList.push("The maximum distance to go can not be empty!");
                error = true;
            }
            
            if(!$scope.selectEditRecommenderValue.visibilityRadius){
                $scope.errorMsgList.push("The visibility radius can not be empty!");
                error = true;
            }
            
            if(!$scope.selectEditRecommenderValue.itemsToRecommend){
                $scope.errorMsgList.push("The number of items to recommend can not be empty!");
                error = true;
            }
            
            if(!$scope.selectEditRecommenderValue.minimumScore){
                $scope.errorMsgList.push("The minimum score for recommending an item can not be empty!");
                error = true;
            }
        
            if(!error){
                Services.updateRecommender($scope.selectEditRecommenderValue, function(res){
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