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
    };
    $scope.staticItemListInScene = [];
    $scope.dynamicItemListInScene = [];
    $scope.newDynamicItem = {
        route: []
    };
    $scope.sceneList = [];
    $scope.loadRandomWay = true;
    $scope.currentPageStaticItems = 0;
    $scope.pageSizeStaticItems = 5; 
    $scope.currentPageDynaicItemsMan = 0;
    $scope.pageSizeDynaicItemsMan = 5;
    $scope.currentPageDynaicItems = 0;
    $scope.pageSizeDynaicItems = 5;
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    
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
    
    $scope.pagesStaticItems = function() {
        var input = [];
        
        for (var i = 0; i < $scope.numberOfPagesStaticItems(); i += 1) {
            input.push(i);
        }
        
        return input;
    };

    $scope.numberOfPagesStaticItems=function(){
        return Math.ceil($scope.staticItemListInScene.length/$scope.pageSizeStaticItems);                
    }
    
    $scope.setCurrentPageStaticItems = function(page){
        $scope.currentPageStaticItems = page;
    }
    
    $scope.previousStaticItems = function(){
        if($scope.currentPageStaticItems != 0){
            $scope.currentPageStaticItems=$scope.currentPageStaticItems-1;
        }
    }
    
    $scope.nextStaticItems = function(){
        if($scope.currentPageStaticItems < $scope.staticItemListInScene.length/$scope.pageSizeStaticItems - 1){
            $scope.currentPageStaticItems=$scope.currentPageStaticItems+1;
        }
    }
    
    $scope.pagesDynaicItemsMan = function() {
        var input = [];
        
        for (var i = 0; i < $scope.numberOfPagesDynaicItemsMan(); i += 1) {
            input.push(i);
        }
        
        return input;
    };

    $scope.numberOfPagesDynaicItemsMan=function(){
        return Math.ceil($scope.newDynamicItem.route.length/$scope.pageSizeDynaicItemsMan);                
    }
    
    $scope.setCurrentPageDynaicItemsMan = function(page){
        $scope.currentPageDynaicItemsMan = page;
    }
    
    $scope.previousDynaicItemsMan = function(){
        if($scope.currentPageDynaicItemsMan != 0){
            $scope.currentPageDynaicItemsMan=$scope.currentPageDynaicItemsMan-1;
        }
    }
    
    $scope.nextDynaicItemsMan = function(){
        if($scope.currentPageDynaicItemsMan < $scope.newDynamicItem.route.length/$scope.pageSizeDynaicItemsMan - 1){
            $scope.currentPageDynaicItemsMan=$scope.currentPageDynaicItemsMan+1;
        }
    }
    
    $scope.pagesDynaicItems = function() {
        var input = [];
        
        for (var i = 0; i < $scope.numberOfPagesDynaicItems(); i += 1) {
            input.push(i);
        }
        
        return input;
    };

    $scope.numberOfPagesDynaicItems=function(){
        return Math.ceil($scope.dynamicItemListInScene.length/$scope.pageSizeDynaicItems);                
    }
    
    $scope.setCurrentPageDynaicItems = function(page){
        $scope.currentPageDynaicItems = page;
    }
    
    $scope.previousDynaicItems = function(){
        if($scope.currentPageDynaicItems != 0){
            $scope.currentPageDynaicItems=$scope.currentPageDynaicItems-1;
        }
    }
    
    $scope.nextDynaicItems = function(){
        if($scope.currentPageDynaicItems < $scope.dynamicItemListInScene.length/$scope.pageSizeDynaicItems - 1){
            $scope.currentPageDynaicItems=$scope.currentPageDynaicItems+1;
        }
    }    
    
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
            $scope.newStaticItem.type = JSON.parse($scope.newStaticItem.type);
            $scope.staticItemListInScene.push({
                name: $scope.newStaticItem.name,
                type: $scope.newStaticItem.type,
                longitude: $scope.newStaticItem.longitude,
                latitude: $scope.newStaticItem.latitude
            });
            
            //$scope.msgList.push("Static item inserted!");
            
            $scope.newStaticItem.name = "";
            $scope.newStaticItem.type = "";
            $scope.newStaticItem.longitude = "";
            $scope.newStaticItem.latitude = "";
    }
    
    $scope.saveDynamicItemInScene = function(){
            $scope.newDynamicItem.type = JSON.parse($scope.newDynamicItem.type);
            $scope.dynamicItemListInScene.push({
                type: $scope.newDynamicItem.type,
                name: $scope.newDynamicItem.dynamicItemName,
                speed: $scope.newDynamicItem.itemSpeed,
                route: $scope.newDynamicItem.route
            });
            
            $scope.msgList.push("Dynamic item inserted!");
            
            dynamicItemsMap.getOverlays().getArray().slice(0).forEach(function(overlay) {
                dynamicItemsMap.removeOverlay(overlay);
            });
             
            $scope.newDynamicItem.type = "";
            $scope.newDynamicItem.dynamicItemName = "";
            $scope.newDynamicItem.itemSpeed = "",
            $scope.newDynamicItem.route = [];
    }
    
    $scope.selectPointToDelete = function(point){
        $scope.selectPointToDeleteValue = point;
    }
    
    $scope.deletePointFromRoute = function(){
        var index = $scope.newDynamicItem.route.indexOf($scope.selectPointToDeleteValue);
        
        if(index>=0){
            $scope.newDynamicItem.route.splice(index, 1);
            dynamicItemsMap.removeOverlay(dynamicItemsMap.getOverlays().getArray()[index]); 
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
    
    /*
     *
     */
    $scope.setRandomWay = function(){
        return ($scope.scene.defineFormFileDynamicItem!="setRandom");
    }
    
    $scope.generateRandomWay = function(){
        var error = false;
        
        if(!$scope.scene.latitudeULC && !$scope.scene.longitudeULC){
            $scope.errorMsgList.push("The upper left corner can not be empty!");
            error = true;
        }
        
        if(!$scope.scene.latitudeLRC && !$scope.scene.longitudeLRC){
            $scope.errorMsgList.push("The lower right corner can not be empty!");
            error = true;
        }
        
        if(!error){
            var data = {
                numberDynamicItems: $scope.randomWay.numberDynamicItems,
                wayType: $scope.randomWay.wayType,
                itemTypeId: $scope.newDynamicItem.type._id,
                latitudeULC: $scope.scene.latitudeULC,
                longitudeULC: $scope.scene.longitudeULC,
                latitudeLRC: $scope.scene.latitudeLRC,
                longitudeLRC: $scope.scene.longitudeLRC,
            }
            
            $scope.loadRandomWay = false;
            
            Services.generateRandomWay(data, function(res){
                $scope.loadRandomWay = true;
                
                $scope.newDynamicItem.type = JSON.parse($scope.newDynamicItem.type);
                for(index in res.itemList){
                    var item = res.itemList[index];
                    
                    $scope.dynamicItemListInScene.push({
                        type: $scope.newDynamicItem.type,
                        name: "item "+index,
                        speed: item.speed, 
                        route: item.route
                    });
                }
                console.log($scope.dynamicItemListInScene);
            }, function(err){
                $scope.errorMsgList.push(err);
            });            
        }
    }
    
    $scope.loadStaticItemsFromFile = function(){ 
        var reader = new FileReader();
        
        reader.onload = function (e) {
            var data = e.target.result; 
            data = JSON.parse(data);
            
            for(i=0;i<data.length;i++){
                $scope.newStaticItem = {
                    type: JSON.stringify(getStaticItemById(data[i].staticItemType)),
                    name: data[i].itemName,
                    longitude: data[i].longitude,
                    latitude: data[i].latitude
                };
                
                $scope.$apply(function () {
                    $scope.saveStaticItemInScene();
                });
            }
        };
        
        var fileInputElement = document.getElementById("staticItemFile");
        reader.readAsText(fileInputElement.files[0]);
    }
    
    function getStaticItemById(id) {
        for(index in $scope.staticItemList){
            if($scope.staticItemList[index]._id==id){
                return $scope.staticItemList[index];
            }
        }
        return null;
    }
    
    $scope.loadDynamicItemsFromFile = function(){
        var reader = new FileReader();

        reader.onload = function (e) {
            var data = e.target.result;
            data = JSON.parse(data);
            
            for(i=0;i<data.length;i++){
                $scope.$apply(function () {
                    $scope.dynamicItemListInScene.push({
                        name: data[i].itemName,
                        speed: data[i].speed,
                        route: data[i].route
                    });
                });
            }
        };
        
        var fileInputElement = document.getElementById("dynamicItemFile");
        reader.readAsText(fileInputElement.files[0]);
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