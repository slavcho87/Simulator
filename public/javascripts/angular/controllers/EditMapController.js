var app = angular.module("app");

app.controller("EditMapController", ['$scope', '$http', 'Services', 'DataFactory', function ($scope, $http, Services, DataFactory) {    
    $scope.errorMsgList = [];
    $scope.step=1;
    $scope.recommenderList = [];
    $scope.scene = {
        defineFormFileDynamicItem: "",
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
       
       //load basic data
       Services.editMapData(DataFactory.data.mapId, function(res){
          if(res.result == "NOK"){
              $scope.errorMsgList.push(res.msg);
          }else{
              $scope.map = {
                  name: res.map.name,
                  type: res.map.type,
                  state: res.map.state
              }
                
              for(index in res.sceneList){
                  var allData = res.sceneList[index]; 
                  $scope.sceneList.push({
                      sceneID: res.sceneList[index]._id,
                      sceneName: res.sceneList[index].sceneName, 	
                      creationDate: res.sceneList[index].creationDate,
                      recommenderSettings: getRecommenderNameFromID(res.sceneList[index].recommender),
                      city: res.sceneList[index].city,
                      allData: allData
                  }); 
              }
          }
       }, function(err){
           $scope.errorMsgList.push(err);
       });       
   }
   
   $scope.formattDDmmYYY = function(date) {
        var d = new Date(date || Date.now()),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
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
    
    $scope.saveMap = function(){
        $scope.map._id = DataFactory.data.mapId;
        Services.updateMap($scope.map, function(res){
            if(res.result == "NOK"){
                $scope.errorMsgList.push(res.msg);    
            }else{
                $scope.msgList.push(res.msg);
            }
        }, function(err){
            $scope.errorMsgList.push(err);
        });
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
                        city: $scope.scene.citySearchValue,
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
    
    function getRecommenderNameFromID(id){
        var recommenderName = "";
        for(index in $scope.recommenderList){
            if($scope.recommenderList[index]._id==id){
                recommenderName = $scope.recommenderList[index].poolName;
            }
        }
        
        return recommenderName;
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
    
    $scope.editScene = function(scene){
        DataFactory.data.scene = scene.allData;
        window.location = '#/map/editScene';
    }
    
    $scope.exit = function(){
        Services.logout();
    }
}]);