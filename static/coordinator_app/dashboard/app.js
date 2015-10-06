//
//
//
//		MODULE:::
//
//
//
angular.module('SO_Coordinator')

.controller("coordinatorDashboardCtrl", ["$scope","$location", "$routeParams", "djRest", 
						function($scope, $location, $routeParams, djRest) {
	
}])
.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/dashboard', {
						 template:'<so-dashboard></so-dashboard>',
						 reloadOnSearch:false,
						 controller: 'coordinatorDashboardCtrl'
					 })

					 ;
				 }])
				 
;
