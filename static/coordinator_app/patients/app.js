//
//
//
//		MODULE:::
//
//
//
angular.module('SO_Coordinator')

.controller("patientsCtrl", ["$scope","$location", "$routeParams", "djRest", "dialogsAndVideoIm", 
						function($scope, $location, $routeParams, djRest, dialogsAndVideoIm) {
	$scope.dialogsAndVideoIm = dialogsAndVideoIm;
	$scope.patient_list = [] ;
	function getPatientList(){
		$scope.loading = true ;
		djRest.PatientsByCoordinator.query(function(data){
			$scope.patient_list = data ;
		},
		function(data){
			$scope.error = "Can't fetch info=(";
		});
	}

	getPatientList();
	
}])


.controller("patientsCreateCtrl", ["$scope","$location", "$routeParams", "djRest", 
						function($scope, $location, $routeParams, djRest) {
	$scope.user_type = 'new';
	$scope.next = function(){
		if ($scope.user_type=='new'){
			$location.path("/coordinator/patients/create/new");
		}
		else{
			$location.path("/coordinator/patients/create/fhir");
		}
	}
	
}])

.controller("patientsCreateNewCtrl", ["$scope","$location", "$routeParams", "djRest", 
						function($scope, $location, $routeParams, djRest) {
	$scope.create_new = true;
	$scope.createProfile = false ;
	$scope.patient = {
		send_email:false,
		patient:{
			gender: 'male',
			maritalStatus: 'U',
			address:[],
			telecom:[{}],
			birthDate:'',
			name:[{given:[], family:[], suffix:[], prefix:[], use:'usual'}],
		}
	} ;
	$scope.create = function(){
		$scope.createProfileProgress = true;
		var p= new djRest.PatientsByCoordinator($scope.patient);
		p.$save(function(data){
			var user_pk=data.owner;
			var photo=$scope.patient.patient.new_photo;
			if (photo){
				djRest.PatientsByCoordinator.uploadPhoto({
					photo: photo,
					user_pk:user_pk
				},
				function(data){
					$scope.patient.photo = data.path ;
					$location.path("/coordinator/patients/edit/"+user_pk);
				},
				function(data){
					$scope.error = "Can't upload photo";
				});
			}
			else{
				$location.path("/coordinator/patients/edit/"+user_pk);
			}
		
		},
		function(data){
			$scope.error = data.error;
			if (!$scope.error){
				$scope.error = "Cant create account. Is email exists?" ;
			}
		});
	}
	$scope.tryAgain = function(){
		$scope.error = '' ;
		$scope.createProfileProgress = false ;
		$scope.createProfile = false;
	}
}])

.controller("patientsCreatePickFromFhirCtrl", ["$scope","$location", "fhirProviders", "djRest", 
						function($scope, $location, fhirProviders, djRest) {
	$scope.j = {hello:{i:1, o:3}} ;
	$scope.createFromCurrent = function(){
		$location.path("/coordinator/patients/create/fhir/import");
	} ;
}])

.controller("patientsCreateFromFhirCtrl", ["$scope","$location", "fhirProviders", "djRest", 
						function($scope, $location, fhirProviders, djRest) {
	$scope.create_fhir = true;
	$scope.createProfile = false ;
	$scope.patient = {patient: fhirProviders.currentFhirProfile};
	$scope.patient.username = '' ;
	$scope.patient.send_email = false;
	$scope.patient.fhir_doc = {};
	if ($scope.patient.patient.hasOwnProperty('name')){
		var name= $scope.patient.patient.name;
		var username='';
		var line;
		for(var given in name[0].given){
			line=name[0].given[given];
			username=username+"_"+line;
		}
		for(var family in name[0].family){
			line=name[0].family[family];
			username=username+"_"+line;
		}
		if(username.length>1){
			username=username.substring(1);
			$scope.patient.username = username;
		}
	}
	if ($scope.patient.patient.hasOwnProperty('telecom')){
		for(var t in $scope.patient.patient.telecom){
			t=$scope.patient.patient.telecom[t];
			if (t.system=='email'){
				$scope.patient.email=t.value;
				break
			}
		}
	}
//	var provider=fhirProviders.PROVIDERS['fhir-open-api.smarthealthit.org'];
	var provider=fhirProviders.PROVIDERS['demo.oridashi.com.au:8290'];
	$scope.provider=fhirProviders.PROVIDERS['fhirtest.uhn.ca'];
	$scope.$watch('provider.startPatientLoad', function(load) {
		if (load || load==undefined){ return; }
		$scope.patient.fhir_doc = $scope.provider.currentPatient;
	});
	$scope.$watch('patient.patient.id', function(patientId) {
		if (patientId==undefined){ return; }
		var patient=$scope.patient.patient;
		var fullName= patient.name[0].given[0]+" "+patient.name[0].family[0];
		$location.search("n",fullName);
		$scope.provider.loadPatient(patientId,
									function(){
										$scope.patient.fhir_doc = $scope.provider.currentPatient;
										$scope.patient.fhir_doc.MedicationPrescription=$scope.provider.currentPatient.MedicationOrder;
									});


		/*
		if (!$scope.patient.fhir_doc.Condition){
			provider.provider.getPatientCondition({'subject\:Patient':patientId},
											  function(data){
												  $scope.fhir_tab = 'Condition' ;
												  $scope.patient.fhir_doc.Condition =data;
											  });
		}
		if(!$scope.patient.fhir_doc.Observations){
			provider.provider.getPatientObservations({'subject\:Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.Observations =data;
											  });
		}

		if(!$scope.patient.fhir_doc.MedicationPrescription){
			provider.provider.getPatientMedicationPrescription({'patient\:Patient':patientId},
											  function(data){
												  data=provider.fixMedicalPrescription(data);
												  $scope.patient.fhir_doc.MedicationPrescription =data;
											  });
		}

		if(!$scope.patient.fhir_doc.MedicationDispence){
			provider.provider.getPatientMedicationDispense({'patient\:Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.MedicationDispence =data;
											  });
		}
		if(!$scope.patient.fhir_doc.Procedure){
			provider.provider.getPatientProcedure({'subject\:Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.Procedure =data;
											  });
		}

		if(!$scope.patient.fhir_doc.Immunization){
			provider.provider.getPatientImmunization({'subject\:Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.Immunization =data;
											  });
		}

		if(!$scope.patient.fhir_doc.FamilyHistory){
			provider.provider.getPatientFamilyHistory({'subject\:Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.FamilyHistory =data;
											  });
		}


		if(!$scope.patient.fhir_doc.AllergyIntolerance){
			provider.provider.getPatientAllergyIntolerance({'subject\:Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.AllergyIntolerance =data;
											  });
		}


		if(!$scope.patient.fhir_doc.ImagingStudy){
			provider.provider.getPatientImagingStudy({'subject\:Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.ImagingStudy =data;
											  });
		}

		if(!$scope.patient.fhir_doc.CarePlan){
			provider.provider.getPatientCarePlan({'subject\:Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.CarePlan =data;
											  });
		}


		if (!$scope.patient.fhir_doc.Condition){
			provider.provider.getPatientCondition({'Patient':patientId},
											  function(data){
												  $scope.fhir_tab = 'Condition' ;
												  $scope.patient.fhir_doc.Condition =data;
											  });
		}
		if(!$scope.patient.fhir_doc.Observations){
			provider.provider.getPatientObservations({'Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.Observations =data;
											  });
		}

		if(!$scope.patient.fhir_doc.MedicationPrescription){
			provider.provider.getPatientMedicationPrescription({'Patient':patientId},
											  function(data){
												  data=provider.fixMedicalPrescription(data);
												  $scope.patient.fhir_doc.MedicationPrescription =data;
											  });
		}

		if(!$scope.patient.fhir_doc.MedicationDispence){
			provider.provider.getPatientMedicationDispense({'Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.MedicationDispence =data;
											  });
		}
		if(!$scope.patient.fhir_doc.Procedure){
			provider.provider.getPatientProcedure({'Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.Procedure =data;
											  });
		}

		if(!$scope.patient.fhir_doc.Immunization){
			provider.provider.getPatientImmunization({'Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.Immunization =data;
											  });
		}

		if(!$scope.patient.fhir_doc.FamilyHistory){
			provider.provider.getPatientFamilyHistory({'Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.FamilyHistory =data;
											  });
		}


		if(!$scope.patient.fhir_doc.AllergyIntolerance){
			provider.provider.getPatientAllergyIntolerance({'Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.AllergyIntolerance =data;
											  });
		}


		if(!$scope.patient.fhir_doc.ImagingStudy){
			provider.provider.getPatientImagingStudy({'Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.ImagingStudy =data;
											  });
		}

		if(!$scope.patient.fhir_doc.CarePlan){
			provider.provider.getPatientCarePlan({'Patient':patientId},
											  function(data){
												  $scope.patient.fhir_doc.CarePlan =data;
											  });
		}

*/

		
		
	}, true);


	$scope.create = function(){


$scope.patient.fhir_doc.ImagingStudy = {
  "resourceType": "Bundle",
  "title": "FHIR Atom Feed",
  "id": "https://fhir-open-api.smarthealthit.org/ImagingStudy/?",
  "link": [
    {
      "rel": "self",
      "href": "https://fhir-open-api.smarthealthit.org/ImagingStudy/?"
    }
  ],
  "totalResults": 2,
  "updated": "2015-09-30T06:36:08.328-00:00",
  "author": [
    {
      "name": "groovy.config.atom.author-name",
      "uri": "groovy.config.atom.author-uri"
    }
  ],
  "entry": [
    {
      "title": "ImagingStudy/1",
      "id": "https://fhir-open-api.smarthealthit.org/ImagingStudy/1",
      "updated": "2015-09-30T06:36:08.328-00:00",
      "content": {
        "resourceType": "ImagingStudy",
        "text": {
          "status": "generated",
          "div": "<div>2013-05-26T04:00:00Z: Knee MRI showing tissue damage</div>"
        },
        "dateTime": "2013-05-26T04:00:00Z",
        "subject": {
          "reference": "Patient/99912345"
        },
        "uid": "urn:sampleoid:2.16.124.113543.6003.sample.1.1",
        "accessionNo": {
          "value": "87654321"
        },
        "modality": [
          "MR"
        ],
        "numberOfSeries": 2,
        "numberOfInstances": 5,
        "description": "Knee MRI showing tissue damage",
        "series": [
          {
            "number": 2,
            "uid": "urn:sampleoid:2.16.124.113543.6003.sample.2.2",
            "numberOfInstances": 2,
            "instance": [
              {
                "number": 1,
                "uid": "urn:sampleoid:2.16.124.113543.6003.sample.3.4",
                "sopclass": "urn:oid:1.2.840.10008.5.1.4.1.1.4",
                "title": "Knee MRI showing tissue damage",
                "attachment": {
                  "reference": "Binary/4-dicom"
                }
              },
              {
                "number": 2,
                "uid": "urn:sampleoid:2.16.124.113543.6003.sample.3.5",
                "sopclass": "urn:oid:1.2.840.10008.5.1.4.1.1.4",
                "title": "Knee MRI showing tissue damage",
                "attachment": {
                  "reference": "Binary/5-dicom"
                }
              }
            ]
          },
          {
            "number": 1,
            "uid": "urn:sampleoid:2.16.124.113543.6003.sample.2.1",
            "numberOfInstances": 3,
            "instance": [
              {
                "number": 1,
                "uid": "urn:sampleoid:2.16.124.113543.6003.sample.3.1",
                "sopclass": "urn:oid:1.2.840.10008.5.1.4.1.1.4",
                "title": "Knee MRI showing tissue damage",
                "attachment": {
                  "reference": "Binary/1-dicom"
                }
              },
              {
                "number": 2,
                "uid": "urn:sampleoid:2.16.124.113543.6003.sample.3.2",
                "sopclass": "urn:oid:1.2.840.10008.5.1.4.1.1.4",
                "title": "Knee MRI showing tissue damage",
                "attachment": {
                  "reference": "Binary/2-dicom"
                }
              },
              {
                "number": 3,
                "uid": "urn:sampleoid:2.16.124.113543.6003.sample.3.3",
                "sopclass": "urn:oid:1.2.840.10008.5.1.4.1.1.4",
                "title": "Knee MRI showing tissue damage",
                "attachment": {
                  "reference": "Binary/3-dicom"
                }
              }
            ]
          }
        ]
      }
    },
    {
      "title": "ImagingStudy/6",
      "id": "https://fhir-open-api.smarthealthit.org/ImagingStudy/6",
      "updated": "2015-09-30T06:36:08.328-00:00",
      "content": {
        "resourceType": "ImagingStudy",
        "text": {
          "status": "generated",
          "div": "<div>2013-05-27T02:30:00Z: Chest CT scan to study bone structure</div>"
        },
        "dateTime": "2013-05-27T02:30:00Z",
        "subject": {
          "reference": "Patient/99912345"
        },
        "uid": "urn:sampleoid:2.16.124.113543.6003.sample.1.2",
        "accessionNo": {
          "value": "98765432"
        },
        "modality": [
          "CT"
        ],
        "numberOfSeries": 2,
        "numberOfInstances": 5,
        "description": "Chest CT scan to study bone structure",
        "series": [
          {
            "number": 1,
            "uid": "urn:sampleoid:2.16.124.113543.6003.sample.2.3",
            "description": "Upper chest area",
            "numberOfInstances": 3,
            "instance": [
              {
                "number": 1,
                "uid": "urn:sampleoid:2.16.124.113543.6003.sample.3.6",
                "sopclass": "urn:oid:1.2.840.10008.5.1.4.1.1.2",
                "title": "Image from chest CT scan to study bone structure",
                "attachment": {
                  "reference": "Binary/6-dicom"
                }
              },
              {
                "number": 2,
                "uid": "urn:sampleoid:2.16.124.113543.6003.sample.3.7",
                "sopclass": "urn:oid:1.2.840.10008.5.1.4.1.1.2",
                "title": "Image from chest CT scan to study bone structure",
                "attachment": {
                  "reference": "Binary/7-dicom"
                }
              },
              {
                "number": 3,
                "uid": "urn:sampleoid:2.16.124.113543.6003.sample.3.8",
                "sopclass": "urn:oid:1.2.840.10008.5.1.4.1.1.2",
                "title": "Image from chest CT scan to study bone structure",
                "attachment": {
                  "reference": "Binary/8-dicom"
                }
              }
            ]
          },
          {
            "number": 2,
            "uid": "urn:sampleoid:2.16.124.113543.6003.sample.2.4",
            "description": "Lower chest area",
            "numberOfInstances": 2,
            "instance": [
              {
                "number": 1,
                "uid": "urn:sampleoid:2.16.124.113543.6003.sample.3.9",
                "sopclass": "urn:oid:1.2.840.10008.5.1.4.1.1.2",
                "title": "Image from chest CT scan to study bone structure",
                "attachment": {
                  "reference": "Binary/9-dicom"
                }
              },
              {
                "number": 2,
                "uid": "urn:sampleoid:2.16.124.113543.6003.sample.3.10",
                "sopclass": "urn:oid:1.2.840.10008.5.1.4.1.1.2",
                "title": "Image from chest CT scan to study bone structure",
                "attachment": {
                  "reference": "Binary/10-dicom"
                }
              }
            ]
          }
        ]
      }
    }
  ]
} ;






















		$scope.createProfileProgress = true;
		var p= new djRest.PatientsByCoordinator($scope.patient);
		p.$save(function(data){
			var user_pk=data.owner;
			var photo=$scope.patient.patient.new_photo;
			if (photo){
				djRest.PatientsByCoordinator.uploadPhoto({
					photo: photo,
					user_pk:user_pk
				},
				function(data){
					$scope.patient.photo = data.path ;
					$location.path("/coordinator/patients/edit/"+user_pk);
				},
				function(data){
					$scope.error = "Can't upload photo";
				});
			}
			else{
				$location.path("/coordinator/patients/edit/"+user_pk);
			}

		},
		function(data){
			$scope.error = data.error;
			if (!$scope.error){
				$scope.error = "Cant create account. Is email exists?" ;
			}
		});
	}
	$scope.tryAgain = function(){
		$scope.error = '' ;
		$scope.createProfileProgress = false ;
		$scope.createProfile = false;
	}
}])

.controller("patientsEditCtrl", ["$scope","$location", "$routeParams", "djRest", 
						function($scope, $location, $routeParams, djRest) {
	djRest.PatientsByCoordinator.get({pk: $routeParams.pk},
									 function(data){
										 $scope.patient = data;
										 var fullName= data.patient.name[0].given[0]+" "+data.patient.name[0].family[0];
										 $location.search("n",fullName);
									 },
									 function(data){
										 $scope.error = "Cant fetch info about user" ;
									 });
	$scope.update = function(){
		djRest.PatientsByCoordinator.update({pk:$routeParams.pk},
										   $scope.patient,
										   function(data){
											   var photo=$scope.patient.patient.new_photo;
											   if (photo){
												   djRest.PatientsByCoordinator.uploadPhoto({
													   photo: photo,
													   user_pk:data.pk
												   },
												   function(data){
													   $scope.patient.photo = data.path ;
												   },
												   function(data){
													   $scope.error = "Can't upload photo";
												   });
											   }
											   $scope.patient = data;

										   },
										   function(data){
											   $scope.error = "Can't update profile";
										   });
	}
}])


.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/coordinator/patients', {
						 templateUrl: _TRGEN_HTML('/static/coordinator_app/patients/list.html'),
						 controller: 'patientsCtrl'
					 })
					 .when('/coordinator/patients/create', {
						 templateUrl: _TRGEN_HTML('/static/coordinator_app/patients/create.html'),
						 controller: 'patientsCreateCtrl'
					 })					 
					 .when('/coordinator/patients/create/fhir', {
						 templateUrl: _TRGEN_HTML('/static/coordinator_app/patients/create_pick_from_fhir.html'),
						 controller: 'patientsCreatePickFromFhirCtrl'
					 })
					 .when('/coordinator/patients/create/fhir/import', {
						 templateUrl: _TRGEN_HTML('/static/coordinator_app/patients/create_update.html'),
						 controller: 'patientsCreateFromFhirCtrl'
					 })							 
					 .when('/coordinator/patients/create/new', {
						 templateUrl: _TRGEN_HTML('/static/coordinator_app/patients/create_update.html'),
						 reloadOnSearch: false,
						 controller: 'patientsCreateNewCtrl'
					 })
					 .when('/coordinator/patients/edit/:pk', {
						 templateUrl: _TRGEN_HTML('/static/coordinator_app/patients/create_update.html'),
						 reloadOnSearch: false,
						 controller: 'patientsEditCtrl'
					 })




					 ;
				 }])
				 
;
