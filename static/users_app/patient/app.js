
angular.module('SO_UserProfile')

.controller("userProfilePatientCtrl", ["$scope","$location", "userProfile", "djRest","sOpinion", 
						function($scope, $location, userProfile, djRest, sOpinion) {
	//
	//
	$scope.sOpinion = sOpinion ;
	$scope.userProfile=userProfile;
	$scope.userProfile.photo = null;
	$scope.tab = 'summary+names' ;
	if ($scope.userProfile.user.patient){
		$scope.profile = $scope.userProfile.user.patient;
	}


	$scope.$watch('userProfile.user.patient', function(patient) {
		$scope.profile = patient;
	}, true);

	$scope.form = {valid:true} ;
	$scope.$watch('profile', function(profile) {
		console.log(profile);
		$scope.form = validators.validatePatient(profile);
	}, true);


	$scope.deleteName = function(index){
		$scope.profile.name.splice(index,1);
	}
	$scope.deleteAddress = function(index){
		$scope.profile.address.splice(index,1);
	};
	$scope.deleteContact = function(index){
		$scope.profile.telecom.splice(index,1);
	}


	$scope.fullUrl = function(){
		return $location.path();
	}
	
}])

.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider
			.when('/patient/profile', {
				templateUrl: _TRGEN_HTML('/static/users_app/patient/patient.html'),
				controller: 'userProfilePatientCtrl'
			})
	
			;
		}])

;
