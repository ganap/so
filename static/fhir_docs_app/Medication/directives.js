//
//
//
//		MODULE:::
//
//
//
angular.module('uiFhirDocs')


.directive('fdMedication', [ 'const', function(c) {
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
		},
		templateUrl: '/static/fhir_docs_app/Medication/fdMedication.html'
	};
}])

.directive('fdMedicationView', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
		},
		template: '{{ngModel.name}}'
	};
}])




.directive('fdMedicationSelect', ["const", function(c) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			fhirDoc:'=',
			ngDisabled: '=?',
		},
		controller: function($scope) {
			$scope.medication_list = [] ;
			$scope.const = c ;
			function generateMedicationList(bundle){
				var medication, name, additional_text;
				var medication_list=[];
				medication_list.push({name: "None", obj: null});
				if (!bundle) return medication_list;

				for (var i = 0; i < bundle.length; i++) {
					medication=bundle[i].content;
					medication_list.push({name: medication.medication.name, obj: medication.medication});
				};
				return medication_list;
			}

			$scope.$watch('fhirDoc.MedicationPrescription.entry', function(bundle) {
				$scope.medication_list = generateMedicationList(bundle);
				for (var i = 0; i < $scope.medication_list.length; i++) {
					if ($scope.medication_list[i].name==$scope.ngModel.name){
						$scope.ngModel.$$mdSelectId = i+1;
						break;
					};
				};
			}, true);
			$scope.medication_list = generateMedicationList($scope.fhirDoc.MedicationPrescription.entry);
		},
		templateUrl: '/static/fhir_docs_app/Medication/fdMedicationSelect.html'
	};
}])



;
