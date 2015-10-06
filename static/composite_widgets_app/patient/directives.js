//
//
//
//		MODULE:::
//
//
//
angular.module('uiCompositeWidgets')

.directive('cwPatientProfile', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			profile:'=',
			kioskMode:'=?',
		},
		controller: function($scope) {
			if (!$scope.profile){
				$scope.profile = {};
			}

			function validateProfile(profile){
				$scope.profile.$form = validators.validatePatient(profile);
			}
			
			validateProfile($scope.profile)
			
			$scope.$watch('profile', function(profile) {
				validateProfile(profile);
			}, true);			
			//
			//
			$scope.deleteName = function(index){
				$scope.profile.name.splice(index,1);
			}
			$scope.deleteAddress = function(index){
				$scope.profile.address.splice(index,1);
			};
			$scope.deleteContact = function(index){
				$scope.profile.telecom.splice(index,1);
			}


		},
		templateUrl: '/static/composite_widgets_app/patient/cwPatientProfile.html'
	};
}])


.directive('cwPatientProfileErrors', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			form:'=',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			
		},
		templateUrl: '/static/composite_widgets_app/patient/cwPatientProfileErrors.html'
	};
}])


.directive('cwPatientSummary', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			patient:'=',
			additionalText:'=?',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			
		},
		templateUrl: '/static/composite_widgets_app/patient/cwPatientSummary.html'
	};
}])


;
