var app = angular.module("app");

app.controller("EvaluationController", ['$scope','Services', function ($scope, Services) {
    $scope.errorMsgList = [];
    $scope.msgList = [];
    $scope.mapList = [];
    $scope.sceneList = [];
    $scope.selectedMap;
    $scope.selectedScene;
    $scope.selectedItems;
    $scope.staticItemList = [];
    $scope.recommenderList = [];
    $scope.allData = [];
    $scope.itemTypeList = [];
    $scope.itemListAllData = [];
    $scope.dataCopy = angular.copy($scope.data);
    $scope.userList = []
    
    $scope.loadData = function(){
        Services.getRecommenderList(function(res){
            angular.forEach(res, function(value, key) {
                $scope.recommenderList.push(value);
            });
        }, function(err){
             $scope.errorMsgList.push(err);
        });
        
        Services.getUserList(function(res){
            if(res.result=="NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                $scope.userList = res.list;
                
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    $scope.loadMapsAndScenesFromRecommenderId = function(){        
        Services.loadMapsAndScenesFromRecommenderId($scope.selectedRecommender._id, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                $scope.allData = res.list;
                
                for(index in $scope.allData){
                    $scope.mapList.push($scope.allData[index].map);
                }
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    $scope.selectMap = function(){
        $scope.sceneList = [];
        for(index in $scope.allData){
            if($scope.allData[index].map._id == $scope.selectedMap._id){
                $scope.sceneList = $scope.allData[index].sceneList;
            }
        }
    }
    
    $scope.selectScene = function(){
        var data = {
            sceneId: $scope.selectedScene._id,
            mapId: $scope.selectedMap._id
        };
        
        Services.staticItemList(function(res){
            for(index in res){
                $scope.itemTypeList.push(res[index]);
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
        
        Services.dynamicItemList(function(res){
            for(index in res){
                $scope.itemTypeList.push(res[index]);                
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
        
        Services.getItemList(data, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                $scope.itemList = res.staticItemList;
                $scope.itemListAllData = angular.copy(res.staticItemList);
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    $scope.selectItemTypes = function(){
        $scope.itemList = [];
        for(index in $scope.itemListAllData){
            if(isTypeSelected($scope.itemListAllData[index].itemType._id)){
                $scope.itemList.push($scope.itemListAllData[index]);
            }
        }
    }
    
    function isTypeSelected(id){
        for(i in $scope.selectedItemTypes){
            if($scope.selectedItemTypes[i]._id == id){
                return true;
            }
        }
        return false;
    }
    
    $scope.loadGraphics = function(){
        for(index in $scope.selectedItems){
            var data = {
                itemId: $scope.selectedItems[index]._id,
                user: $scope.selectedUser.token
            }
            
            Services.getRatingData(data, function(res){
                google.charts.load('current', {'packages':['corechart']});
                google.charts.setOnLoadCallback(drawVisualization);
                
                function drawVisualization() {
                    var data = [
                        ['Item name', 'User rating',   'Error']
                    ]
                    
                    for(index in res.itemList[index]){
                        var error = '';
                        if(res.itemList[index].valueForecast){
                            error = res.itemList[index].value - res.itemList[index].valueForecast;
                        }
                        
                        data.push([
                            res.itemList[index].itemId.itemName,
                            res.itemList[index].value,
                            error
                        ]);
                    }
                    
                   // var data = google.visualization.arrayToDataTable(data);

                    //no data inserted
                    /*var data = google.visualization.arrayToDataTable([
                      ['', { role: 'annotation' }],
                      ['', '']
                  ]);*/
                    
                    var options = {
                        title : 'Evaluation of recommender',
                        vAxis: {title: 'Rating'},
                        hAxis: {title: 'Item'},
                        seriesType: 'bars',
                        series: {1: {type: 'line'}}
                    };

                    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
                    chart.draw(data, options);
                              
                }                
                
            }, function(err){
                $scope.errorMsgList.push(err);
            });
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
     *
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