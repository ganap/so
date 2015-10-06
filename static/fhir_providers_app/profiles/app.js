//
//
//
//		MODULE:::
//
//
//

angular.module('uiFhirProviders')


.controller("profileCreateFromFhirCtrl", ["$scope","$location", "fhirProviders", "djRest", 
						function($scope, $location, fhirProviders, djRest) {
	$scope.profile = fhirProviders.currentFhirProfile;
	$scope.create_new = true;
}])

.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/providers/profile/create-from-fhir', {
						 templateUrl:'/static/fhir_providers_app/profiles/create.html',
						 controller: 'profileCreateFromFhirCtrl'
					 })


					 ;
				 }])
				 
;

