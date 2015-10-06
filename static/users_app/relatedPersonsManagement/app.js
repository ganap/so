//
//
//
//		MODULE:::
//
//
//
angular.module('SO_RelatedPersons', ['ngRoute'])


.controller("relatedPersonsListCtrl", ["$scope","userProfile", "djRest", "$location" ,
						function($scope, userProfile, djRest, $location) {
	$scope.persons_list = [] ;
	$scope.userProfile = userProfile;
	$scope.links = [];
	$scope.nodes=[
		$scope.userProfile.user
	]
	$scope.onNodeClick = function(person){
		if (!person){return;}
		if (person.pk==$scope.userProfile.user.pk) return;
		location.hash="#/patient/related-persons/edit/"+person.pk;
	}	
	function loadRelatedPersons(pk){
		$scope.error = '' ;
		$scope.loading = true;
		if (!pk){
			return;
		}
		console.log(pk);
		djRest.RelatedPersons.query({additional: 'owner', pk: pk},
									  function(data){
										  $scope.persons_list = data ;
										  $scope.loading = false ;
										  console.log($scope.persons_list);
										  $scope.nodes = [$scope.userProfile.user];
										  $scope.nodes[0].main = true;
										  for (var i = 0; i < data.length; i++) {
										  	 $scope.nodes.push(data[i]);
										  };
										  var links=[];
										  console.log($scope.nodes);
										  for (var i = 0; i < $scope.nodes.length; i++) {
											  links.push({
												  source:0,
												  target:i
											  });
										  };
										  $scope.links =  links;
										  console.log($scope.links);
									  },
									  function(data){
										  $scope.error = "Can't download persons info=(" ;
										  $scope.loading = false ;
									  });	
	}
	$scope.$watch('userProfile.user.pk', function(pk) {
		if (pk){
			loadRelatedPersons(pk);
		}
	});


	$scope.delete = function(person){
		djRest.RelatedPersons.delete({pk:person.pk},
									 function(data){
										var index=$scope.persons_list.indexOf(person);
										$scope.persons_list.splice(index,1);
									 },
									 function(data){
										 $scope.error = "Can't delete object. Try again later." ;
									 });
	}


	loadRelatedPersons(userProfile.user.pk);
	
}])

.controller("relatedPersonsCreateCtrl", ["$scope","$location", "djRest",  
						function($scope, $location, djRest) {
	$scope.newRelatedPerson = {
			gender: 'male',
			relationship: [],
			telecom: [],
			period: {start:null, end: null}
	} ;
	

	$scope.createPerson = function(args){
		djRest.RelatedPersons.create($scope.newRelatedPerson,
									 function(data){
										 $location.path("/patient/related-persons");
									 },
									 function(data){
										 $('body').scrollTop(0);
										 $scope.error = "Can't save object. Try again later." ;
									 });
	}
}])


.controller("relatedPersonsUpadeteCtrl", ["$scope","$location", "djRest", "$routeParams", 
						function($scope, $location, djRest, $routeParams) {
	
	$scope.person = {
			gender: 'male',
			relationship: [],
			telecom: [],
			period: {start:null, end: null}
	} ;
	

	function getRelatedPerson(){
		$scope.loading = true ;
		djRest.RelatedPersons.get({pk: $routeParams.pk},
									 function(data){
										 $scope.person = data;
										 $scope.loading = false ;
									 },
									 function(data){
										 $('body').scrollTop(0);
										 $scope.error = "Can't get object. Try again later." ;
										 $scope.loading = false;
									 });
	}


	$scope.updatePerson = function(){
		djRest.RelatedPersons.update({pk: $routeParams.pk},
									$scope.person,
									function(data){
										$location.path("/patient/related-persons");
									},
									function(data){
										 $('body').scrollTop(0);
										$scope.error = "Can't save object. Try again later." ;
									});
	}
	getRelatedPerson();
}])


.controller("relatedPersonsChartCtrl", ["$scope","$location", "userProfile", "djRest", 
						function($scope, $location, userProfile, djRest) {
	$scope.userProfile = userProfile ;
	$scope.patient = $scope.userProfile.user ;

	$scope.links =  [
		{
			"source": 0 ,
			"target":1,
			"value":1
		},
		{
			"source":0,
			"target":2,
			"value":1
		}
		,
		{
			"source":0,
			"target":3,
			"value":1
		}
		
	]
;
	$scope.nodes =[
		{
			"username": "Hello",
			"group":1,
			"main":true,
			"expert":"",
			"pk":2
		},
		{
			"username": "Admin",
			"relationShip":["Friend", "Wife"],
			"is_admin":true,
			"group":1,
			"expert":""
		},
		{
			"username": "Moderator",
			"relationShip":["Friend", "Wife"],
			"is_moderator":true,
			"group":1,
			"expert":"",
			"pk":3
		}
,
		{
			"username": "Moderator",
			"relationShip":["Friend", "Wife"],
			"group":1,
			"expert":{"name":{"given":["Andy", "P."], "family":["Cats"]}}
		}		
	];

	
}])
.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/patient/related-persons', {
						 templateUrl: _TRGEN_HTML('/static/users_app/relatedPersonsManagement/list.html'),
						 controller: 'relatedPersonsListCtrl'
					 })
					 .when('/patient/related-persons/create', {
						 templateUrl: _TRGEN_HTML('/static/users_app/relatedPersonsManagement/create.html'),
						 controller: 'relatedPersonsCreateCtrl'
					 })
					 .when('/patient/related-persons/edit/:pk', {
						 templateUrl: _TRGEN_HTML('/static/users_app/relatedPersonsManagement/update.html'),
						 controller: 'relatedPersonsUpadeteCtrl'
					 })
					 .when('/patient/related-persons/chart', {
						 templateUrl: _TRGEN_HTML('/static/users_app/relatedPersonsManagement/chart.html'),
						 controller: 'relatedPersonsChartCtrl'
					 })

					 ;
				 }])
				 
;
