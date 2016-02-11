'use strict';
 
var app = angular.module("app");

app.service('Services', ['$http', '$localStorage', function($http, $localStorage){
    function changeUser(user) {
        angular.extend(currentUser, user);
    }
 
    function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        
        return window.atob(output);
    }
 
    function getUserFromToken() {
        var token = $localStorage.token;
        var user = {};
        
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        
        return user;
    }
 
    var currentUser = getUserFromToken();
 
    return {
        save: function(data, success, error) {
            $http.post('/user/save', data).success(success).error(error);
        },
        login: function(data, success, error) {
            $http.post('/user/authenticate', data).success(success).error(error);
        },
        uploadImgProfile: function(data, success, error) {
            $http.post('/user/uploadPhoto', data).success(success).error(error);
        },
        mapSave: function(data, success, error) {
            $http.post('/maps/save', data).success(success).error(error);
        },
        citySearch: function(data, success, error) {
            $http.get('/maps/city/search/'+data).success(success).error(error);
        },
        recommenderSave: function(data, success, error){
            $http.post('/settings/recommenderSave', data).success(success).error(error);
        },
        getRecommenderList: function(success, error){
            $http.get('/settings/recommenderList').success(success).error(error);
        },
        deleteRecommender: function(data, success, error){
            $http.delete('/settings/deleteRecommender/'+data).success(success).error(error);
        },
        updateRecommender: function(data, success, error){
            $http.post('/settings/updateRecommender', data).success(success).error(error);
        },
        saveItem: function(data, success, error){
            $http.post('/settings/saveItem', data).success(success).error(error);
        },
        staticItemList: function(success, error){
            $http.get('/settings/staticItemList').success(success).error(error);
        },
        dynamicItemList: function(success, error){
            $http.get('/settings/dynamicItemList').success(success).error(error);
        },
        updateItem: function(data, success, error){
            $http.post('/settings/updateItem', data).success(success).error(error);
        },
        deleteItem: function(data, success, error){
            $http.delete('/settings/deleteItem/'+data).success(success).error(error);
        },
        updatePassword: function(data, success, error){
            $http.post('/user/updatePassword', data).success(success).error(error);
        },
        updateUserName: function(data, success, error){
            $http.post('/user/updateUserName', data).success(success).error(error);
        },
        saveScene: function(data, success, error){
            $http.post('/maps/saveScene', data).success(success).error(error);
        },
        deleteScene: function(data, success, error){
            $http.delete('/maps/deleteScene/'+data).success(success).error(error);
        },
        getUser: function(){
            return currentUser;
        },
        getUserImg: function(success, error){
            $http.get('/user/img').success(success).error(error);
        },
        findMaps: function(data, success, error){
            $http.post('/maps/findMaps',data).success(success).error(error);
        },
        findSceneListFromMapId: function(data, success, error){
            $http.get('/maps/sceneListFromMapId/'+data).success(success).error(error);
        }, 
        getItemList: function(data, success, error){
            $http.post('/maps/itemList', data).success(success).error(error);
        },
        staticItemInfo: function(data, success, error){
            $http.get('/maps/staticItemInfo/'+data).success(success).error(error);
        },
        dynamicItemRoute: function(data, success, error){
            $http.post('/maps/dynamicItemRoute', data).success(success).error(error);
        },
        deleteMap: function(data, success, error){
            $http.delete('/maps/deleteMap/'+data).success(success).error(error);
        },
        editMapData: function(data, success, error){
            $http.get('/maps/editMapData/'+data).success(success).error(error);
        },
        updateMap: function(data, success, error){
            $http.post('/maps/updateMap', data).success(success).error(error);
        },
        updateScene: function(data, success, error){
            $http.post('/maps/updateScene', data).success(success).error(error);
        },
        recommenderTypes: function(success, error){
            $http.get('/settings/recommenderTypes').success(success).error(error);
        },
        logout: function() {
            changeUser({});
            delete $localStorage.token;
        }
    };
}]);