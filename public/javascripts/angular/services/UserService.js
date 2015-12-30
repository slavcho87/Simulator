'use strict';
 
var app = angular.module("app");

app.service('UserService', ['$http', '$localStorage', function($http, $localStorage){
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
        citySearch: function(data, success, error) {
            $http.get('/maps/city/search/'+data).success(success).error(error);
        },
        logout: function(success) {
            changeUser({});
            delete $localStorage.token;
            success();
        }
    };
}]);