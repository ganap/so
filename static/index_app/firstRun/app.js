//
//
//
//		MODULE:::
//
//
//
angular.module('SO_FirstRun', ['ngRoute', 'uiBirthdayPicker'])


.controller("firstRunCtrl", ["$scope","$location", "userProfile",  
						function($scope, $location, userProfile) {
	$scope.profile_type = 'P' ;
	$scope.userProfile = userProfile;
	
	$scope.next = function(){
		if ($scope.profile_type=='P'){
			$location.path("/first-run/patient");
		}
		else{
			$location.path("/first-run/organization");
		}
	}
	$scope.human = {} ;
}])

.controller("createPatientCtrl", ["$scope","djRest", "userProfile", "$location", 
						function($scope, djRest, userProfile, $location) {
	var email="@";

	$scope.userProfile = userProfile;
	$scope.sex = 'male';
	$scope.tab = 'sex' ;
	$scope.birthday = null;
	$scope.humanName = null;
	$scope.photo = {};
	$scope.maritalStatus = 'U';
	$scope.address = null;
	
	if ($scope.userProfile.user.hasOwnProperty('email')){
		email=$scope.userProfile.user.email;
	}

	$scope.contact = {
		system:'email',
		use: 'home',
		period: null,
		value:email
	};
	$scope.contacts = [] ;

	$scope.$watch('userProfile.user.email', function(email) {
		$scope.contact.system = 'email' ;
		$scope.contact.value = email ;
	});

	$scope.addNewContact = function(){
		$scope.contacts.push({});
	}


	$scope.deleteContact = function(index){
		$scope.contacts.splice(index,1);
	}

	$scope.registrationComplete = function(){
		var contacts=[$scope.contact];
		console.log($scope.photo);
		contacts=$.merge(contacts, $scope.contacts);

		var user={
			name: $scope.humanName,
			telecom: contacts,
			photo: $scope.photo,
			birthDate: $scope.birthday,
			gender: $scope.sex,
			maritalStatus: $scope.maritalStatus,
			address: $scope.address
		};
		console.log(user);
		$scope.tab = 'create-profile' ;
		$scope.creatingAccount = true ;
		$scope.error = '' ;
		//
		//
		//
		djRest.OwnProfile
			.createPatientProfile(user,
							  function(data){
								  $scope.userProfile.user.patient=data;

								  $scope.creatingAccount = false ;
								  if ($scope.photo.result){
									  $scope.uploadingPhoto = true ;
									  djRest.OwnProfile.uploadPhoto({photo: $scope.photo},
																	function(data){
																		$scope.userProfile.updateAvatar();
																		$location.path('/first-run/patient/created');
																	},
																	function(data){
																		$scope.uploadingPhoto = false ;
																		$scope.error = "Can't upload photo" ;
																	});
								  }
								  else{
									  $location.path('/first-run/patient/created');
								  }
							  },
							  function(data){
								  $scope.creatingAccount = false ;
								  $scope.error = "Cant create profile";
							  });
	}
	
}])

.controller("patientCreatedCtrl", ["$scope","$location", "$routeParams",  
						function($scope, $location, $routeParams) {
	$scope.rperson = {
		gender: 'male',
		relationship: [],
		telecom: [],
		period: {start:null, end: null}
	} ;
	
}])

.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider
			.when('/first-run', {
				templateUrl: _TRGEN_HTML('/static/index_app/firstRun/firstRun.html'),
				controller: 'firstRunCtrl'
			})
			.when('/first-run/patient', {
				templateUrl: _TRGEN_HTML('/static/index_app/firstRun/createPatient.html'),
				controller: 'createPatientCtrl'
			})
			.when('/first-run/patient/created', {
				templateUrl: _TRGEN_HTML('/static/index_app/firstRun/patientCreated.html'),
				controller: 'patientCreatedCtrl'
			})			
			.otherwise({redirectTo: '/'})
			;
		}])

;
