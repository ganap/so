//
//
//
//		MODULE:::
//
//
//
angular.module('uiFhirDocs')

.controller('fdTabContentBaseCtrl', ["$scope", "$route", "$location", function($scope, $route, $location) {

	$scope.$route = $route;

	function checkLocation(params){
		if (params.hasOwnProperty($scope.tab_name)){
			var location=params[$scope.tab_name];
			if (!location){
				$scope.location = 'main' ;
				return;
			}
			$scope.location = params[$scope.tab_name] ;
		}
		else{
			$scope.location = 'main';
		}				
	}
	$scope.$watch('$route.current.params', function(params) {
		checkLocation(params);
	}, true);


	$scope.goBack = function(){
		$location.search($scope.tab_name,null);
	}
	$scope.currentAttachment = {};
	$scope.oncurrentAttachment = function(attachment){
		$scope.currentAttachment = attachment ;
	}
	//
	checkLocation($route.current.params);
}])




.directive('fdHealthRecords', [ "$controller", function($controller) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			patient:'=',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			$scope.tab_name = 'health_record' ;
			$controller('fdTabContentBaseCtrl', {
				$scope: $scope
			});

		},
		templateUrl: '/static/fhir_docs_app/tabContent/fdHealthRecords.html'
	};
}])



.directive('fdMedicationsAndTreatments', [ "$controller", "$mdDialog",  function($controller, $mdDialog) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			patient:'=',
			kioskMode:'=?',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			$scope.tab_name = 'med_prescr' ;
			$scope.newObj = {};
			$controller('fdTabContentBaseCtrl', {
				$scope: $scope
			});

			$scope.cancel=function(){
				$mdDialog.cancel();
			}
			$scope.done=function(){
				if ($scope.newObj.hasOwnProperty('medication')){
					$scope.patient.fhir_doc.MedicationPrescription.entry.push({
						content: $scope.newObj
					});
				}
				if ($scope.newObj.hasOwnProperty('type_')){
					$scope.patient.fhir_doc.Treatment.entry.push({
						content: $scope.newObj
					});
				}
				$mdDialog.cancel();
			}
			$scope.onAddMedication = function(){
				$scope.newObj = {
					medication:{
						name:''
					},
					dosageInstruction:[{
						doseQuantity:{
							code:'',
							system:'',
							units:'',
							value:1
						},
						timingSchedule:{
							event:[{}],
							repeat:{
								frequency:1,
								duration:1,
								units:'d'
							}
						}
					}]
				} ;
				$scope.templateUrl = '/static/fhir_docs_app/tabContent/fdMedicationAddModal.html' ;
				$scope.title = "Add Medication" ;
				$mdDialog.show({
					templateUrl: '/static/fhir_docs_app/tabContent/modalWindowEditObjModal.html',
					parent: angular.element(document.body),
					controller: function () { this.parent = $scope; },
						controllerAs: 'ctrl',
					clickOutsideToClose:true
				});						
			}




			$scope.onAddTreatment = function(){
				console.log("ADD");
				$scope.newObj = {
					type_:'r',
					radiation:{},
					chemotherapy:{},
					surgery:{},
					alternative:{}
				} ;
				$scope.templateUrl = '/static/fhir_docs_app/tabContent/fdTreatmentAddModal.html' ;
				$scope.title = "Add Treatment" ;
				$mdDialog.show({
					templateUrl: '/static/fhir_docs_app/tabContent/modalWindowEditObjModal.html',
					parent: angular.element(document.body),
					controller: function () { this.parent = $scope; },
						controllerAs: 'ctrl',
					clickOutsideToClose:true
				});						
			}


			$scope.fixed = false ;
			function fixFhirDoc(fhir_doc){
				if (!fhir_doc) return fhir_doc;
				if(fhir_doc.hasOwnProperty('MedicationPrescription')){
					if (!fhir_doc.MedicationPrescription.hasOwnProperty('entry')){
						fhir_doc.MedicationPrescription.entry=[];
					}
				}
				if(fhir_doc.hasOwnProperty('Treatment')){
					fhir_doc.Treatment={};
					if (!fhir_doc.Treatment.hasOwnProperty('entry')){
						fhir_doc.Treatment.entry=[];
					}
				}
				$scope.fixed = true;
				return fhir_doc;
			}


			if ($scope.patient){
				var fhir_doc = fixFhirDoc($scope.patient.fhir_doc);
				if (fhir_doc){
					$scope.fhir_doc=fhir_doc;
				}
			}
			$scope.$watch('patient.fhir_doc', function(fhir_doc) {
				if(fhir_doc){
					$scope.patient.fhir_doc =  fixFhirDoc(fhir_doc);
				}
			}, true);
			
		},
		templateUrl: '/static/fhir_docs_app/tabContent/fdMedicationsAndTreatments.html'
	};
}])


;
