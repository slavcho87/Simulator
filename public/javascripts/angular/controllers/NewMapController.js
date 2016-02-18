var app = angular.module("app");

app.controller("NewMapController", ['$scope', '$http', '$localStorage', 'Services', function ($scope, $http, $localStorage, Services) {
    $scope.errorMsgList = [];
    $scope.msgList = [];
    $scope.step=1;
    $scope.cityList = [];
    $scope.hideScene = true;
    $scope.recommenderList = [];
    $scope.staticItemList = [];
    $scope.dynamicItemList = [];
    $scope.scene = {
        defineFormFileDynamicItem: "",
        maximumStaticItemsToDisplay: 50,
        maximumDynamicItemsToDisplay: 50
    };
    $scope.staticItemListInScene = [];
    $scope.dynamicItemListInScene = [];
    $scope.newDynamicItem = {
        route: []
    };
    $scope.sceneList = [];
        
    $scope.mapSave = function(){
        var error = false;
        
        if(!$scope.map || !$scope.map.name){
            $scope.errorMsgList.push("The name of map can not be empty");
            error = true;
        }
        
        if(!$scope.map || !$scope.map.type){
            $scope.errorMsgList.push("The type of map can not be empty");
            error = true;
        } 
        
        if(!$scope.map || !$scope.map.state){
            $scope.errorMsgList.push("The state of map can not be empty");
            error = true;
        }
        
        if(!error){
            Services.mapSave($scope.map, function(res){
                if(res.result == "OK"){
                    $scope.msgList.push(res.msg);
                    $scope.hideScene = false;
                    $scope.map.id=res.id;
                    
                    setEditableFalse("mapName");
                    setEditableFalse("mapType");
                    setEditableFalse("mapState");
                    setEditableFalse("btnSaveMap");
                }else{
                    $scope.errorMsgList.push(res.msg);    
                }
            },function(error){
                $scope.errorMsgList.push(error);
            });   
        }
    }
    
    function setEditableFalse(id){
        var element = document.getElementById(id);
        element.setAttribute("disabled", false);
    }
    
    $scope.citySearch = function(){
        if(!$scope.scene.citySearchValue || $scope.scene.citySearchValue.length == 0){
            $scope.errorMsgList.push("Insert city name!");
        }else{
            Services.citySearch($scope.scene.citySearchValue, function(res){
                $scope.cityList = res; 
            },function(error){
               $scope.errorMsgList.push("Error: "+error);
            });
        }
    }

    /*
     * 
     */
    $scope.setStep = function(stepNumber){
        $scope.step = stepNumber;
        
        staticItemsMap.getView().setCenter(limitMap.getView().getCenter());
        staticItemsMap.getView().setZoom(limitMap.getView().getZoom());

        dynamicItemsMap.getView().setCenter(limitMap.getView().getCenter());
        dynamicItemsMap.getView().setZoom(limitMap.getView().getZoom());
    }
    
    /*
     * Devuelve true si y solo si tenemos que ocultar uno de los divs en la creacion de una escena
     */
    $scope.isStepActivate = function(stepNumer){        
        return ($scope.step != stepNumer);
    }
    
    $scope.saveScene = function(){
        var error = false;
        $scope.scene.staticItemList = $scope.staticItemListInScene;
        $scope.scene.dynamicItemList = $scope.dynamicItemListInScene;
        $scope.scene.mapId = $scope.map.id;
        $scope.scene.zoom = dynamicItemsMap.getView().getZoom();
        
        if(!$scope.scene.name){
           $scope.errorMsgList.push("The name of scene can not be empty!");
            error = true;
        }
        
        if(!$scope.scene.recommenderSettings){
            $scope.errorMsgList.push("The recommender can not be empty!");
            error = true;
        }
        
        if(!$scope.scene.latitudeULC && !$scope.scene.longitudeULC){
            $scope.errorMsgList.push("The upper left corner can not be empty!");
            error = true;
        }
        
        if(!$scope.scene.latitudeLRC && !$scope.scene.longitudeLRC){
            $scope.errorMsgList.push("The lower right corner can not be empty!");
            error = true;
        }
        
        if(!error){
            Services.saveScene($scope.scene, function(res){ 
                if(res.result == "NOK"){
                    $scope.errorMsgList.push(res.msg);
                }else{
                    $scope.msgList.push(res.msg);

                    $scope.sceneList.push({
                        sceneID: res.id,
                        sceneName: $scope.scene.name, 	
                        creationDate: res.creationDate,
                        recommenderSettings: getRecommenderNameFromID($scope.scene.recommenderSettings),
                        staticItemNumber: $scope.scene.staticItemList.length,
                        dynamicItemNumber: $scope.scene.dynamicItemList.length,
                        city: $scope.scene.city,
                    });

                    $scope.dynamicItemListInScene = [];
                    $scope.dynamicItemListInScene = []; 
                    $scope.scene.staticItemList = [];
                    $scope.scene.dynamicItemList = [];
                    $scope.scene.name = "";
                    $scope.scene.citySearchValue = "";
                    $scope.scene.latitudeULC = "";
                    $scope.scene.longitudeULC = "";
                    $scope.scene.latitudeLRC = "";
                    $scope.scene.longitudeLRC = "";
                    $scope.scene.maximumStaticItemsToDisplay = "";
                    $scope.scene.maximumStaticItemsToDisplay = "";
                    $scope.scene.mapId = "";
                    $scope.scene.recommenderSettings = "";
                    $scope.scene.zoom = "";
                    $scope.scene.selectedCity = "";             
                }
            }, function(err){
                $scope.errorMsgList.push(err);
            });            
        }
    }
    
    $scope.selectSceneToDelete = function(scene){
        $scope.selectSceneToDeleteValue = scene;
    }
    
    $scope.deleteScene = function(){
        Services.deleteScene($scope.selectSceneToDeleteValue.sceneID, function(res){
            if(res.result=="NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                $scope.msgList.push(res.msg);
                
                var index =  $scope.sceneList.indexOf($scope.selectSceneToDeleteValue);
                if(index>=0){
                    $scope.sceneList.splice(index, 1);
                }else{
                    $scope.errorMsgList.push(ERROR_HAS_OCCURRED);
                }
            }   
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    $scope.saveStaticItemInScene = function(){
        if($scope.staticItemListInScene.length < $scope.scene.maximumStaticItemsToDisplay){
            $scope.newStaticItem.type = JSON.parse($scope.newStaticItem.type);
            $scope.staticItemListInScene.push({
                name: $scope.newStaticItem.name,
                type: $scope.newStaticItem.type,
                longitude: $scope.newStaticItem.longitude,
                latitude: $scope.newStaticItem.latitude
            });
            
            $scope.msgList.push("Static item inserted!");
            
            $scope.newStaticItem.name = "";
            $scope.newStaticItem.type = "";
            $scope.newStaticItem.longitude = "";
            $scope.newStaticItem.latitude = "";
        }else{
            $scope.errorMsgList.push("Element limit reached!");
        }
    }
    
    $scope.saveDynamicItemInScene = function(){
        if($scope.dynamicItemListInScene.length < $scope.scene.maximumDynamicItemsToDisplay){
            $scope.newDynamicItem.type = JSON.parse($scope.newDynamicItem.type);
            $scope.dynamicItemListInScene.push({
                type: $scope.newDynamicItem.type,
                name: $scope.newDynamicItem.dynamicItemName,
                speed: $scope.newDynamicItem.itemSpeed,
                route: $scope.newDynamicItem.route
            });
            
            $scope.msgList.push("Dynamic item inserted!");
            
            $scope.newDynamicItem.type = "";
            $scope.newDynamicItem.dynamicItemName = "";
            $scope.newDynamicItem.itemSpeed = "",
            $scope.newDynamicItem.route = [];
        }else{
            $scope.errorMsgList.push("Element limit reached!");
        }
    }
    
    $scope.selectPointToDelete = function(point){
        $scope.selectPointToDeleteValue = point;
    }
    
    $scope.deletePointFromRoute = function(){
        var index = $scope.newDynamicItem.route.indexOf($scope.selectPointToDeleteValue);
        
        if(index>=0){
            $scope.newDynamicItem.route.splice(index, 1);
        }else{
            $scope.errorMsgList.push(ERROR_HAS_OCCURRED);
        }
    }
    
    $scope.selectStaticItemToDeleteFromScene = function(item, index){
        $scope.selectStaticItemToDeleteFromSceneValue = item;
        $scope.selectStaticItemToDeleteFromSceneIndex = index;
    }
    
    $scope.deleteStaticItemFromScene = function(){
        var index = $scope.staticItemListInScene.indexOf($scope.selectStaticItemToDeleteFromSceneValue);
        
        if(index>=0){
            $scope.staticItemListInScene.splice(index, 1);
            staticItemsMap.removeOverlay(overlayList[$scope.selectStaticItemToDeleteFromSceneIndex]);
        }else{
            $scope.errorMsgList.push(ERROR_HAS_OCCURRED);
        }
    }
    
    $scope.selectDynamicItemToDelete = function(item){
        $scope.selectDynamicItemToDeleteValue = item;
    }
    
    $scope.deleteDynamicItemFromScene = function(){
        var index = $scope.dynamicItemListInScene.indexOf($scope.selectDynamicItemToDeleteValue);
        
        if(index>=0){
            $scope.dynamicItemListInScene.splice(index, 1);    
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
     *
     */
    $scope.loadFromFileSelected = function(){        
        return ($scope.scene.defineForm!="loadFromFile");
    }
    
    /*
     *
     */
    $scope.loadFromFileSelectedDynamicItem = function(){
        return ($scope.scene.defineFormFileDynamicItem!="loadFromFileDynamicItem");
    }
    
    /*
     *
     */
    $scope.setManuallySelected = function(){
        return ($scope.scene.defineForm!="setManually");
    }
    
    $scope.loadStaticItemsFromFile = function(){
        console.log($scope.scene.staticItemFile);
    }
    
    $scope.loadDynamicItemsFromFile = function(){
        console.log($scope.scene.dynamicItemFile);
    }
    
    /*
     *
     */
    $scope.setManuallySelectedDynamicItem = function(){
        return ($scope.scene.defineFormFileDynamicItem!="setManuallyDynamicItem");
    }
    
    function getRecommenderNameFromID(id){
        var recommenderName = "";
        for(index in $scope.recommenderList){
            if($scope.recommenderList[index]._id==id){
                recommenderName = $scope.recommenderList[index].poolName;
            }
        }
        
        return recommenderName;
    }
    
    $scope.loadData = function(){
        //load recommeders list
        Services.getRecommenderList(function(res){
            angular.forEach(res, function(value, key) {
                $scope.recommenderList.push(value);
            });
        }, function(err){
             $scope.errorMsgList.push(err);
        });
        
        //load static items
        Services.staticItemList(function(res){
           for(index in res){
                $scope.staticItemList.push(res[index]);
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
        
        //load dynamic items
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
        
    $scope.exit = function(){
        Services.logout();
    }
}]);