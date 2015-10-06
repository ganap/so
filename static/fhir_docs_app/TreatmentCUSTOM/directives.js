//
//
//
//		MODULE:::
//
//
//
angular.module('uiFhirDocs')


.directive('fdTreatmentSimpleCustom', [ 'const', function(c) {
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
		templateUrl: '/static/fhir_docs_app/TreatmentCUSTOM/fdTreatmentSimpleCustom.html'
	};
}])

.directive('fdTreatmentCustom', [ 'const', function(c) {
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
		templateUrl: '/static/fhir_docs_app/TreatmentCUSTOM/fdTreatmentCustom.html'
	};
}])

.directive('fdTreatmentMainText', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
		},
		controller: function($scope) {
		},
		templateUrl: '/static/fhir_docs_app/TreatmentCUSTOM/fdTreatmentMainText.html'
	};
}])


.directive('fdTreatmentAdditionalText', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
		},
		controller: function($scope) {
		},
		templateUrl: '/static/fhir_docs_app/TreatmentCUSTOM/fdTreatmentAdditionalText.html'
	};
}])

.directive('fdTreatmentSelect', ["const", function(c) {
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
			$scope.treatment_list = [] ;
			$scope.const = c ;
			function generateTreatmentList(bundle){
				var treatment, name, additional_text;
				var treatment_list=[];
				treatment_list.push({name: "None", obj: null});
				if (!bundle) return treatment_list;

				for (var i = 0; i < bundle.length; i++) {
					treatment=bundle[i].content;
					name=c.getKeyByVal('TREATMENT_TYPES_CUSTOM_TYPES', treatment.type_);
					additional_text='';
					if (treatment.type_=='r'){
						if (treatment.radiation.type_){
							additional_text=treatment.radiation.type_;
						}
						if (treatment.radiation.dosage){
							additional_text=additional_text+ " ("+treatment.radiation.dosage+") ";
						}
					}
					if (treatment.type_=='c'){
						if (treatment.chemotherapy.regiment){
							additional_text=treatment.chemotherapy.regiment;
						}
					}
					if (treatment.type_=='s'){
						if (treatment.surgery.type_){
							additional_text=treatment.surgery.type_;
						}
					}
					if (treatment.type_=='a'){
						if(treatment.alternative.type_){
							additional_text=treatment.alternative.type_;
						}
					}
					if (additional_text.length){
						name=name+" / "+additional_text;
					}
					treatment_list.push({name: name, obj: treatment});
				};
				return treatment_list;
			}

			$scope.$watch('fhirDoc.Treatment.entry', function(bundle) {
				$scope.treatment_list = generateTreatmentList(bundle);
			}, true);
			$scope.treatment_list = generateTreatmentList($scope.fhirDoc.Treatment.entry);
		},
		templateUrl: '/static/fhir_docs_app/TreatmentCUSTOM/fdTreatmentSelect.html'
	};
}])




.directive('fdTreatmentSummaryCustom', ["$location", "$controller",  function($location, $controller) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			bundle:'=',
			onAddClick: '&?',
			kioskMode:'=?',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			//$scope.viewMode = false;
			$controller('editViewBtn', {
				$scope: $scope
			});
			$scope.fhirDocTitle = 'Treatment';
			$scope.searchKey = 'med_prescr' ;
			$scope.templateUrl = '/static/fhir_docs_app/TreatmentCUSTOM/fdTreatmentSummaryCustom.html' ;


			$scope.$watch('bundle', function(bundle) {
				var entry=bundle.entry;
				if (!entry.length){
					$scope.latest = {} ;
					$scope.error = "No Treatment available." ;
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
