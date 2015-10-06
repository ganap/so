//
//
//
//		MODULE:::
//
//
//
angular.module('SO_Experts')


.controller("dashboardCtrl", ["$scope","$location", "$routeParams", "djRest", 
						function($scope, $location, $routeParams, djRest) {
	
}])


.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/dashboard', {
						 templateUrl: _TRGEN_HTML('/static/expert_app/dashboard/dashboard.html'),
						 controller: 'dashboardCtrl'
					 })

					 ;
				 }])
				 
;
