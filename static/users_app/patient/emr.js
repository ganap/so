//
//
//
//
angular.module('SO_UserProfile')

.controller("emrPatientManagementCtrl", ["$scope","$location", "djRest",  
						function($scope, $location, djRest) {
}])

.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/patient/emr', {
						 templateUrl: _TRGEN_HTML('/static/users_app/patient/healthData.html'),
						 reloadOnSearch: false,
						 controller: 'emrPatientManagementCtrl'
					 })

					 ;
				 }])
				 
;
