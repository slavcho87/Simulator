var app = angular.module("app", ['ngRoute', 'ngStorage', 'checklist-model', 'xeditable']);

app.config(['$routeProvider', '$httpProvider' ,function($routeProvider, $httpProvider) {	 		   
	$routeProvider.when('/', {
		templateUrl: 'views/index.html',
		controller: 'LoginController'
	}).when('/register', {
		templateUrl: 'views/register.html',
		controller: 'RegisterController'
	}).when('/map', {
		templateUrl: 'views/maps/index.html',
		controller: 'MapController'
	}).when('/map/newMap', {
		templateUrl: 'views/maps/newMap.html',
		controller: 'NewMapController'        
	}).when('/map/editScene', {
		templateUrl: 'views/maps/editScene.html',
		controller: 'EditSceneController'        
	}).when('/map/editMap', {
		templateUrl: 'views/maps/editMap.html',
		controller: 'EditMapController'
	}).when('/simulator', {
		templateUrl: 'views/simulator/index.html',
		controller: 'SimulatorController'
	}).when('/settings', {
		templateUrl: 'views//settings/recommenderSettings.html',
		controller: 'RecommenderSettingsController'
    }).when('/settings/staticItemSettings', {
		templateUrl: 'views/settings/staticItemSettings.html',
		controller: 'StaticItemSettingsController'
    }).when('/settings/dynamicItemSettings', {
		templateUrl: 'views/settings/dynamicItemSettings.html',
		controller: 'DymanicItemSettingsController'
    }).when('/profile', {
		templateUrl: 'views/configurations/index.html',
		controller: 'ConfigurationController'
    }).when('/evaluations', {
		templateUrl: 'views/evaluations/index.html',
		controller: 'EvaluationController'
	}).otherwise({
        redirectTo: '/'
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