var _TRGEN_HTML = function(x){return x;}
var _TR = function(x){ return x; }

//
//		Services
//

angular.module("Base",[])


.service("const", ["$http", "djRest", function($http, djRest) {
	//
	//
	this.swinging_style_types={};
	this.MODEL_TYPES={};
	this.MODEL_TYPES_ORIGINAL={};
	this.L18N={};
	var self=this;


	this.getKeyByVal = function(field, value){
		if (self.MODEL_TYPES_ORIGINAL.hasOwnProperty(field)){
			return self.MODEL_TYPES_ORIGINAL[field][value];
		}
		return '';
	}
	djRest.SitePreferences.modelTypes(function(data){
		self.MODEL_TYPES=data.swapped;
		self.MODEL_TYPES_ORIGINAL=data.original;
	});


	$http.get("/api/L18n1/locales/").
		success(function(data, status, headers, config){
			if (! data.hasOwnProperty('error')){
				self.L18N.locales=data;
			}
	});
}])


.filter('units', [function () { 
    return function (type, system) {
		//	system=['gb', 'metric']
		//	type=['temperature', 'height', 'weight']
		//
		var UNITS={
			'gb':{
				'temperature':'F',
				'height': 'inch',
				'weight':'lb',
			},
			'metric':{
				'temperature': 'C',
				'height':'cm',
				'weight':'kg',
			}
		}
		try{
			return UNITS[system][type];
		}
		catch(e){
			return '';
		}
    };    
}])


//
//
//
//		RestFul
//
//
//
//
.service("djRest", ["$resource", function($resource) {
	var mkFormData =  function(json){
			var fd = new FormData();
			for (var key in json){
				fd.append(key, json[key]);
			}
			fd.append("csrfmiddlewaretoken", Cookies.get("csrftoken"));
			return fd;
			json['csrfmiddlewaretoken']=Cookies.get("csrftoken");
			return json;
	};
	var Attachments= $resource("/api/v1/fhir-profiles/attachments/:additional/:pk/ ");

	Attachments.upload = function(obj, on_success, on_error, on_progress){
		var progress = function(e){
			if(e.lengthComputable){
				var p=e.loaded/e.total*100;
				p=Number((p).toFixed(1));
				on_progress(p);
			}
		}
		return $.ajax({
			url: '/api/v1/attachments/',  //Server script to process data
			type: 'POST',
			xhr: function() {  // Custom XMLHttpRequest
				var myXhr = $.ajaxSettings.xhr();
				if(myXhr.upload){ // Check if upload property exists
					myXhr.upload.addEventListener('progress',progress, false); // For handling the progress of the upload
				}
				return myXhr;
			},
			//Ajax events
			success: function(data){
				on_success(data);
			},
			error: function(data){
				on_error(data);
			},

			// Form data
			data: mkFormData(obj),
			//Options to tell jQuery not to process data or worry about content-type.
			cache: false,
			contentType: false,
			processData: false
		});
	}

	return {
		"Attachments": Attachments,
		"d":$resource("/api/v1// ",
										   null,
										   {
											   'save':{
												   'method':'POST',
												   'transformRequest':function(data, headers){
													   return mkFormData(data);
												   },
												   'headers': {'Content-Type': undefined}
											   },
											   'update': { method:'PUT' }
										   }),
		"Registration": $resource("/api/v1/registration/:additional/:username/:email/ ",
						   null,
						   {
							   'login':{
								   method: 'PUT',
							   },
							   'logout':{
								   method: 'DELETE',
							   },
							   'createUser':{
								   method: 'POST',
							   },
							   'isUsernameExists':{
								   method:'GET',
								   params:{
									   additional:'username-is-in-db'
								   }
							   },
							   'isEmailExists':{
								   method:'GET',
								   params:{
									   additional:'email-is-in-db'
								   }
							   },
							   'resetPassword':{
								   method: 'POST',
								   params:{
									   additional: 'reset-password'
								   }
							   }

						   }),
		"OwnProfile": $resource("/api/v1/own-profile/:additional/:additional2/ ",
							   null,
							   {
								   createPatientProfile:{
									   method: 'POST',
									   params:{
										   additional: 'patient',
									   },
								   },
								   updatePatientProfile:{
									   method: 'PUT',
									   params:{
										   additional: 'patient',
									   },
								   },
								   uploadPhoto:{
									   method: 'POST',
									   params:{
										   additional: 'photos',
									   },
									   transformRequest: function(data, headers){
										   return mkFormData(data);
									   },
									   headers: {'Content-Type': undefined}
								   },
								   measurements:{
									   method: 'GET',
									   params: {
										   additional: 'measurements',
									   }
								   },
								   createMeasurements:{
									   method: 'POST',
									   params: {
										   additional: 'measurements',
									   }
								   },
								   updateLastDayMeasure:{
									   method: 'PUT',
									   params:{
										   additional:'measurements',
										   additional2: 'everyday-list'
									   }
								   },
								   setDayMeasure:{
									   method: 'POST',
									   params:{
										   additional:'measurements',
										   additional2: 'everyday-list'
									   }
								   }
							   }),
		"RelatedPersons": $resource("/api/v1/fhir-profiles/related-persons/:additional/:pk/:additional2/ ",
								   null,
								   {
									   create:{
										   method: 'POST',
									   },
									   update:{
										   method: 'PUT',
									   }
								   }),
		"SitePreferences": $resource("/api/v1/site-pref/:additional/ ",
									null,
									{
										modelTypes:{
											method: 'GET',
											params:{
												additional: 'model-types'
											}
										},
										update:{
											method: 'PUT',
										}

									}),
		"Coordinators": $resource("/api/v1/coordinators/:pk/ "),
		"Experts": $resource("/api/v1/experts/:pk/:additional/ ",
							null,
							{
								update:{
									method: 'PUT',
								},
								uploadPhoto:{
									method: 'POST',
									params:{
										additional: 'photos',
									},
									transformRequest: function(data, headers){
										return mkFormData(data);
									},
									headers: {'Content-Type': undefined}
								}
							}),
		"Patients": $resource("/api/v1/patients/:pk/ ",
							null,
							{
								update:{
									method: 'PUT',
								}
							}),
		"PatientsByCoordinator": $resource("/api/v1/patients-by-coordinator/:pk/:additional/ ",
							null,
							{
								update:{
									method: 'PUT',
								},
								uploadPhoto:{
									method: 'POST',
									params:{
										additional: 'photos',
									},
									transformRequest: function(data, headers){
										return mkFormData(data);
									},
									headers: {'Content-Type': undefined}
								}
							}),

		"SOpinion": $resource("/api/v1/so/:additional/:pk/ ",
							null,
							{
								update:{
									method: 'PUT',
								},
                                own:{
                                    method: 'GET',
                                    params:{
                                        additional:'own',
                                    }
                                }
							}),

		"Paypal": $resource("/api/v1/paypal/:additional/:pk/ ",
						   null,
						   {
							   'button':{
								   method:'GET',
								   params:{
									   additional:'button',
								   }
							   },
                               userTrIdCount:{
                                   method:'GET',
                                   params:{
                                       additional:'users'
                                   }
                               }
						   }),

	}
}])

;
