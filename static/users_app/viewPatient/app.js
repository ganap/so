//
//
//
//
//
//
angular.module('SO_UserProfile')

.controller("viewPatientCtrl", ["$scope","$routeParams", "sOpinion", "djRest", "userProfile",
						function($scope, $routeParams, sOpinion, djRest, userProfile) {
	djRest.Patients.get({pk: $routeParams.pk},
						function(data){
							$scope.patient = data;
						},
						function(data){
							$scope.error = "Can't get info about patient=(" ;
						});

}])
.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/patients/view/:pk', {
						 templateUrl: _TRGEN_HTML('/static/users_app/viewPatient/view.html'),
						 reloadOnSearch: false,
						 controller: 'viewPatientCtrl'
					 })
					 ;
				 }])
				 
;
