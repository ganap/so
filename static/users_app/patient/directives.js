angular.module("SO_UserProfile")


.directive('upPatientView', [ "userProfile", function(userProfile) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			patient:'=',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			$scope.userProfile = userProfile;

			function getCanEdit(patient){
				return false;
				var own_pk=$scope.userProfile.user.pk;
				return patient.pk_can_edit.indexOf(own_pk)>-1;
			}


			$scope.$watch('patient', function(patient) {
				$scope.kioskMode = !getCanEdit(patient) ;
			});
			$scope.kioskMode = !getCanEdit($scope.patient);
		},
		templateUrl: '/static/users_app/patient/upPatientView.html'
	};
}])

