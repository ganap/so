//
//
//
//		MODULE:::
//
//
//
//
function fixFhirDoc(doc){
	var new_doc={};
	var obj;
	function fixGender(gender){
		if (typeof(gender)==typeof({})){
			console.log(gender);
			if (gender.hasOwnProperty('coding')){
				gender=gender.coding[0].display;
				return gender.toLowerCase();
			}
			return {'error': "Cant get gender from file"};
		}
		return gender;
	}
	function fixAddress(address){
		if (address.hasOwnProperty('zip')){
			address.postalCode=address.zip;
		}
		return address;
	}
	for (var key in doc){
		obj=doc[key]
		if (key=='gender'){
			obj=fixGender(obj);
		}
		if (key=='address'){
			var addresses=[];
			for(var n in doc[key]){
				addresses.push(
					fixAddress(doc[key][n])
				);
			}
			obj=addresses;
		}
		new_doc[key]=obj;
	}
	console.log(new_doc);
	return new_doc;

}
angular.module('uiFhirProviders')


.service("exampleFhirProvider", ["$http", "djRest", "$resource", function($http, djRest, $resource){

	var self=this;
	this.name="fhir-open-api.smarthealthit.org";
	this.url='https://fhir-open-api.smarthealthit.org';
	this.patients_list=[];
	this.provider=$resource('/api/v1/site-pref/download/'+this.url+"/:destination/:search",
						   null,
	{
		getPatients:{
			method: 'GET',
			params:{
				destination:'Patient'
			}
		},
		getPatientCondition:{
			method: 'GET',
			params:{
				destination:'Condition',
				search:'_search'
			}
		},
		//https://fhir-api.smarthealthit.org/Observation/_search?subject%3APatient=1288992
		getPatientObservations:{
			method:'GET',
			params:{
				destination: 'Observation',
				search:'_search',
			}
		},
		//https://fhir-api.smarthealthit.org/MedicationPrescription/_search?patient%3APatient=1288992
		getPatientMedicationPrescription:{
			method:'GET',
			params:{
				destination: 'MedicationPrescription',
				search:'_search',
			}
		},
		//https://fhir-api.smarthealthit.org/MedicationDispense/_search?patient%3APatient=1288992
		getPatientMedicationDispense:{
			method:'GET',
			params:{
				destination: 'MedicationDispense',
				search:'_search',
			}
		},
		//https://fhir-api.smarthealthit.org/Procedure/_search?subject%3APatient=1288992
		getPatientProcedure:{
			method:'GET',
			params:{
				destination: 'Procedure',
				search:'_search',
			}
		},
		//https://fhir-api.smarthealthit.org/Immunization/_search?subject%3APatient=1288992
		getPatientImmunization:{
			method:'GET',
			params:{
				destination: 'Immunization',
				search:'_search',
			}
		},
		//https://fhir-api.smarthealthit.org/FamilyHistory/_search?subject%3APatient=1288992
		getPatientFamilyHistory:{
			method:'GET',
			params:{
				destination: 'FamilyHistory',
				search:'_search',
			}
		},
		//https://fhir-api.smarthealthit.org/AllergyIntolerance/_search?subject%3APatient=1288992
		getPatientAllergyIntolerance:{
			method:'GET',
			params:{
				destination: 'AllergyIntolerance',
				search:'_search',
			}
		},
		//https://fhir-api.smarthealthit.org/ImagingStudy/_search?subject%3APatient=1288992
		getPatientImagingStudy:{
			method:'GET',
			params:{
				destination: 'ImagingStudy',
				search:'_search',
			}
		},
		//https://fhir-api.smarthealthit.org/CarePlan/_search?patient%3APatient=1288992
		getPatientCarePlan:{
			method:'GET',
			params:{
				destination: 'CarePlan',
				search:'_search',
			}
		},

	}
	);

	this.postprocessPatient = function(list){
		var postprocessed=[];
		var obj;
		for (var key in list){
			obj=list[key];
			obj=fixFhirDoc(obj.content);
			postprocessed.push(obj);
		}
		return postprocessed;
	}


	this.loadAllPatients = function(){
		self.loading=true;
		console.log(self.url);
		$http.get('/api/v1/site-pref/download/'+self.url+"/Patient/").
			success(function(data, status, headers, config){
				console.log(data);
				self.patients_list=self.postprocessPatient(data.entry);
				self.loading=false;
		});
	}
	this.loadPatientCondition = function(patientIdentifier){
		self.loading=true;
		$http.get(self.url+"/Condition/_search?subject:Patient="+patientIdentifier).
			success(function(data, status, headers, config){
				console.log("Condition");
				console.log(data);
		});
	}


	this.fixMedicalPrescription = function(bundle){
			function collectMedications(medicationPrescription){
				//	в бандле почему-то разделяют лекарства
				//	и описание MedicationPrescription
				//	заменяя на ссылку #id
				//
				var medications={};
				var id;
				for (var i = 0; i < medicationPrescription.contained.length; i++) {
					id=medicationPrescription.contained[i].id;
					medications["#"+id]=medicationPrescription.contained[i];
				};
				return medications;
			}
			function fixMedicationPrescription(medicationPrescription){
				if (medicationPrescription.medication.hasOwnProperty('reference')){
					var medication=collectMedications(medicationPrescription);
					var reference=medicationPrescription.medication.reference;
					medicationPrescription.medication = medication[reference];
				}
				return medicationPrescription;
			}

			for (var i = 0; i < bundle.entry.length; i++) {
				bundle.entry[i].content = fixMedicationPrescription(
					bundle.entry[i].content
				);
			};
			return bundle;
	}

}])


.service("fhirProviders", [ "djRest", '$http', 'exampleFhirProvider','oridashiFhirProvider', "fhirtestFhirProvider",
						function(djRest, $http, exampleFhirProvider, oridashiFhirProvider, fhirtestFhirProvider) {
	this.PROVIDERS={
		//"fhir-open-api.smarthealthit.org": exampleFhirProvider,
		"demo.oridashi.com.au:8290":oridashiFhirProvider,
		"fhirtest.uhn.ca": fhirtestFhirProvider,
	};
	this.currentFhirProfile=null;
}])


.directive('uiFhirProvidersList', [ 'fhirProviders', function(fhirProviders) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			currentProvider:'=',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			$scope.fhirProviders = fhirProviders;

			if ($scope.currentProvider){
				$scope.currentP = $scope.currentProvider.name;
			}
			$scope.$watch('currentP', function(currentP) {
				$scope.currentProvider = $scope.fhirProviders.PROVIDERS[currentP] ;
			});
		},
		templateUrl: '/static/fhir_providers_app/providers/uiFhirProvidersList.html'
	};
}])


.directive('uiFhirDocumentsList', ['fhirProviders', '$location',  function(fhirProviders, $location) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			currentProvider:'=',
			onDocClick: '&?'
		},
		controller: function($scope) {
			$scope.searchString = '' ;
			function loadList(){
				try{

				if (!$scope.currentProvider.patients_list.length){
					$scope.currentProvider.loadAllPatients();
				}
				}
				catch(e){
					
				}
			}
			loadList();
			$scope.$watch('currentProvider.name', function(name) {
				loadList();
				console.log("change");
			}, true);

			$scope.createProfile = function(doc){
				fhirProviders.currentFhirProfile = doc;
				$scope.onDocClick();
			}
		},
		templateUrl: '/static/fhir_providers_app/providers/uiFhirDocumentsList.html'
	};
}])


;

