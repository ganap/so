angular.module("uiFhirProviders")










.service("fhirtestFhirProvider", ["$http", "djRest", "$resource", function($http, djRest, $resource){

	var self=this;
	this.name="fhirtest.uhn.ca";
	this.url='http://fhir-dev.healthintersections.com.au/open';
	this.downloadUrl='/api/v1/site-pref/download/'+this.url;
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
			obj=fixFhirDoc(obj.resource);
			postprocessed.push(obj);
		}
		return postprocessed;
	}

	var FHIR_POINTS=['Condition', 'ImagingStudy', 'MedicationPrescription', 'Observation', 'MedicationStatement', 'MedicationOrder'];

	function fixResource(data){
		var new_data=[];
		for (var i = 0; i < data.length; i++) {
			if (data[i].hasOwnProperty('resource')){
				data[i].content=data[i].resource;
			}
			new_data.push(data[i]);
		};
		return data;
	}
	this.loadPatient = function(id, on_done){
		if (self.startPatientLoad){ return; }
		self.currentPatient={};
		self.startPatientLoad=true;
		self.FHIR_POINTS_DOWNLOADED=[];
		var url;
		var key;
		for (var i = 0; i < FHIR_POINTS.length; i++) {
			
			url=self.downloadUrl+"/"+FHIR_POINTS[i]+"/_search?_patient=Patient/"+id;
			key=FHIR_POINTS[i];
			console.log(key);
			$http.get(url).
				success(function(data, status, headers, config){
					key=config.url.replace(self.downloadUrl,"").split("/")[1];
					self.FHIR_POINTS_DOWNLOADED.push(key);
					data.entry=fixResource(data.entry);
					self.currentPatient[key]=data;
					if (self.FHIR_POINTS_DOWNLOADED.length==FHIR_POINTS.length){
						self.startPatientLoad=false;
						on_done();
					}
			});
		};
		
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

