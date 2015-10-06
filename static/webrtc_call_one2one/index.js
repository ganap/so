

var app = angular.module("WebRTC", [ 
	'ngMaterial',
	'ngMessages',
	'ngRoute',
	'ngResource'
]
)



.controller("defaultCtrl", ["$scope","$location",   
						function($scope, $location) {
	$scope.leave = function(){
		window.close();
	}
}])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('pink');
})

.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/', {
						 templateUrl: _TRGEN_HTML('/static/index_app/default.html'),
						 controller: 'defaultCtrl'
					 })

					 ;
				 }])
;
