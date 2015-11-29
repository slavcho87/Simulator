var app = angular.module("app", ['ngRoute', 'ngStorage']);

app.config(['$routeProvider', '$httpProvider' ,function($routeProvider, $httpProvider) {	 		   
	$routeProvider.when('/', {
		templateUrl: 'views/index.html',
		controller: 'LoginController'
	}).when('/register', {
		templateUrl: 'views/register.html',
		controller: 'LoginController'
	}).when('/map', {
		templateUrl: 'views/maps/index.html',
		controller: 'MapController'
	}).when('/map/newMap', {
		templateUrl: 'views/maps/newMap.html',
		controller: 'MapController'        
	}).when('/map/editScene', {
		templateUrl: 'views/maps/editScene.html',
		controller: 'MapController'        
	}).when('/map/editMap', {
		templateUrl: 'views/maps/editMap.html',
		controller: 'MapController'
	}).when('/simulator', {
		templateUrl: 'views/simulator/index.html',
		controller: 'SimulatorController'
	}).when('/parameters', {
		templateUrl: 'views/parameters/index.html',
		controller: 'ConfigurationController'
    }).when('/parameters/simulationSettings', {
		templateUrl: 'views/parameters/simulationSettings.html',
		controller: 'ConfigurationController'
    }).when('/parameters/recommenderSettings', {
		templateUrl: 'views/parameters/recommenderSettings.html',
		controller: 'ConfigurationController'
    }).when('/profile', {
		templateUrl: 'views/configurations/index.html',
		controller: 'ConfigurationController'
	}); 
    
    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
        return {  
            'request': function (config) {    
                config.headers = config.headers || {};
                
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                
                return config;
            
            },
            
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/signin');
                }
                
                return $q.reject(response);
            }
        };    
    }]);    
}]);