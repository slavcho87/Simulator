var app = angular.module("app");

app.controller("EditSceneController", ['$scope', '$http', 'Services', 'DataFactory', function ($scope, $http, Services, DataFactory) { 
    $scope.errorMsgList = [];
    $scope.step=1;
    $scope.recommenderList = [];
    $scope.scene = {
        defineFormFileDynamicItem: "",
        _id: DataFactory.data.scene._id, 
        city: DataFactory.data.scene.city,
        creationDate: DataFactory.data.scene.creationDate,
        latitudeLRC: DataFactory.data.scene.latitudeLRC,
        latitudeULC: DataFactory.data.scene.latitudeULC,
        longitudeLRC: DataFactory.data.scene.longitudeLRC,
        longitudeULC: DataFactory.data.scene.longitudeULC,
        mapId: DataFactory.data.scene.mapId,
        recommenderSettings: DataFactory.data.scene.recommender,
        name: DataFactory.data.scene.sceneName,
        selectedCity: DataFactory.data.scene.selectedCity,
    };
    $scope.cityList = [];
    $scope.staticItemList = [];
    $scope.dynamicItemList = [];
    $scope.staticItemListInScene = [];
    $scope.dynamicItemListInScene = [];
    $scope.msgList = [];  
    $scope.newDynamicItem = {
        route: []
    };
    $scope.sceneList = [];
    
    $scope.loadData = function(){
        //load recommeders list
        Services.getRecommenderList(function(res){
            angular.forEach(res, function(value, key) {
                $scope.recommenderList.push(value);
            });
        }, function(err){
             $scope.errorMsgList.push(err);
        });
       
       //load static items types
        Services.staticItemList(function(res){
           for(index in res){
               $scope.staticItemList.push(res[index]);   
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
        
        //load dynamic items types
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
        
        //load items
        var data = {
            sceneId: $scope.scene._id,
            mapId: DataFactory.data.mapId
        };
        
        Services.getItemList(data, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);
            }else{
                angular.forEach(res.staticItemList, function(value, key) {
                    if(value.itemType.type=="dynamic"){
                         var data2 = {
                             sceneId: data.sceneId, 
                             mapId: data.mapId,
                             itemId: value._id
                        };
                        
                        getDynamicItem(value, data2);
                    }else if(value.itemType.type=="static"){
                        var staticItem = {
                            name: value.itemName,
                            type: {
                                name: value.itemType.name,
                                icon: value.itemType.icon,
                                _id: value.itemType._id
                            },
                            longitude: value.location.longitude,
                            latitude: value.location.latitude
                        };
                        
                        $scope.staticItemListInScene.push(staticItem);
                         
                        var location = [parseFloat(value.location.latitude), parseFloat(value.location.longitude)];
                        var overlay = new ol.Overlay({
                            position: ol.proj.transform(location, 'EPSG:4326', 'EPSG:3857'),
                            element: $('<img src="'+value.itemType.icon+'" class="img-circle">')
                            .css({marginTop: '-50%', marginLeft: '-50%', width: '32px', height: '32px', cursor: 'pointer'})        
                        });
                        overlayList[key-1] = overlay;
                        staticItemsMap.addOverlay(overlay);
                    }
                });
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
    }
    
    function getDynamicItem(value, data){
        Services.dynamicItemRoute(data, function(res){
            var route = [];
            for(index in res.route){
                var point = {
                    lat: res.route[index].routeId.latitude,
                    long: res.route[index].routeId.longitude
                };
                
                route.push(point);
            }
            
            var dynamicItem = {
                name: value.itemName,
                type: {
                    name: value.itemType.name,
                    icon: value.itemType.icon,
                    _id: value.itemType._id
                },
                speed: res.route[0].routeId.speed,
                route: route
            };
            
            $scope.dynamicItemListInScene.push(dynamicItem);
        }, function(err){
            $scope.errorMsgList.push(err);
        });        
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
    
    $scope.saveDynamicItemInScene = function(){
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
   
   $scope.saveScene = function(){
       var error = false;
       $scope.scene.staticItemList = $scope.staticItemListInScene;
       $scope.scene.dynamicItemList = $scope.dynamicItemListInScene;
       $scope.scene.mapId = DataFactory.data.mapId;
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
            Services.updateScene($scope.scene, function(res){
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
    
    $scope.deleteDynamicItemFromScene = function(){
        var index = $scope.dynamicItemListInScene.indexOf($scope.selectDynamicItemToDeleteValue);
        
        if(index>=0){
            $scope.dynamicItemListInScene.splice(index, 1);    
        }else{
            $scope.errorMsgList.push(ERROR_HAS_OCCURRED);
        }
    } 
     
    $scope.saveStaticItemInScene = function(){
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
    $scope.setManuallySelectedDynamicItem = function(){
        return ($scope.scene.defineFormFileDynamicItem!="setManuallyDynamicItem");
    }
    
    /*
     *
     */
    $scope.loadFromFileSelectedDynamicItem = function(){
        return ($scope.scene.defineFormFileDynamicItem!="loadFromFileDynamicItem");
    }
    
    $scope.loadStaticItemsFromFile = function(){
        console.log($scope.scene.staticItemFile);
    }
    
    $scope.loadDynamicItemsFromFile = function(){
        console.log($scope.scene.dynamicItemFile);
    }
    
    $scope.exit = function(){
        Services.logout();
    }
}]);