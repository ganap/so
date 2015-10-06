//
//
//
//		MODULE:::
//
//
//
angular.module('uiFhirDocs')


.directive('fdDosageInstruction', [ 'const', function(c) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			editMode: '=?',
			simpleMode:'=?',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			$scope.const = c ;
		},
		templateUrl: '/static/fhir_docs_app/MedicationPrescription/fdDosageInstruction.html'
	};
}])


.directive('fdMedicationPrescriptionCustom', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			editMode:'=?',
			ngDisabled: '=?'
		},
		controller: function($scope) {

		},
		templateUrl: '/static/fhir_docs_app/MedicationPrescription/fdMedicationPrescriptionCustom.html'
	};
}])

.directive('fdMedicationPrescriptionSimpleCustom', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			editMode:'=?',
			ngDisabled: '=?'
		},
		controller: function($scope) {

		},
		templateUrl: '/static/fhir_docs_app/MedicationPrescription/fdMedicationPrescriptionSimpleCustom.html'
	};
}])

.directive('fdMedicationPrescriptionSummaryCustom', ["$location", "$controller",  function($location, $controller) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			bundle:'=',
			kioskMode:'=?',
			onAddClick: '&?',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			//$scope.viewMode = false;
			$controller('editViewBtn', {
				$scope: $scope
			});
			$scope.fhirDocTitle = 'MedicationPrescription';
			$scope.searchKey = 'med_prescr' ;
			$scope.templateUrl = '/static/fhir_docs_app/MedicationPrescription/fdMedicationPrescriptionSummaryCustom.html' ;


			$scope.$watch('bundle', function(bundle) {
				var entry=bundle.entry;
				if (!entry.length){
					$scope.latest = {} ;
					$scope.error = "No Presctiptions available." ;
					return;
				}
				$scope.latest = entry[entry.length-1].content;
				$scope.error = '' ;
			}, true);

		},
		templateUrl: '/static/fhir_docs_app/basic/fdSummary.html'
	};
}])



;
