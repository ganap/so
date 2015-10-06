//
//
//
//		MODULE:::
//
//
//
angular.module('SO_Admin')

.controller("expertsCtrl", ["$scope","$location", "$routeParams", "djRest", 
						function($scope, $location, $routeParams, djRest) {
	$scope.expert_list = [] ;
	function getExpertList(){
		$scope.loading = true ;
		djRest.Experts.query(function(data){
			$scope.expert_list = data ;
		},
		function(data){
			$scope.error = "Can't fetch info=(";
		});
	}

	getExpertList();
	
	$scope.delete = function(pk){
		djRest.Experts.delete({pk:pk},
								   function(data){
									   getExpertList();
								   },
								   function(data){
									   $scope.error = "Can't delete expert. Try again later." ;
								   });
	}
}])

.controller("expertsCreateCtrl", ["$scope","$location", "djRest",  
						function($scope, $location, djRest) {
	$scope.create_new = true ;
	$scope.expert = {send_email:false, 
		expert:{
			degree:'', link_to_drupal:'',
			speciality:'', clinical_expertise:''
		}
	} ;

	$scope.create = function(){
		$scope.createProfileProgress = true;
		var p= new djRest.Experts($scope.expert);
		p.$save(function(data){
			var user_pk=data.pk;
			var photo=$scope.expert.new_photo;
			if (photo){
				djRest.Experts.uploadPhoto({
					photo: photo,
					user_pk:user_pk
				},
				function(data){
					$scope.expert.photo = data.path ;
					$location.path("/admin/experts/"+user_pk);
				},
				function(data){
					$scope.error = "Can't upload photo";
				});
			}
			else{
				$location.path("/admin/experts/"+user_pk);
			}
		
		},
		function(data){
			$scope.error = data.error;
			if (!$scope.error){
				$scope.error = "Cant create account. Is email exists?" ;
			}
		});
	}

}])

.controller("expertsUpdateCtrl", ["$scope","$location", "djRest", "$routeParams", 
						function($scope, $location, djRest, $routeParams) {
	$scope.expert = {send_email:false} ;
	$scope.loading = true;
	djRest.Experts.get({pk:$routeParams.pk},
							function(data){
								$scope.loading = false ;
								$scope.expert = data ;
							},
							function(data){
								$scope.error = "Can't fetch this user";
								$scope.loading = false ;
							});
	$scope.update = function(){
		djRest.Experts.update({pk: $routeParams.pk},
							 $scope.expert,
							 function(data){
								 var user_pk=data.pk;
								 var photo=$scope.expert.new_photo;
								 if (photo){
									 djRest.Experts.uploadPhoto({
										 photo: photo,
										 user_pk:user_pk
									 },
									 function(data){
										 $scope.expert.photo = data.path ;
										 $location.path("/admin/experts/"+user_pk);
									 },
									 function(data){
										 $scope.error = "Can't upload photo";
									 });
								 }
								 else{
									 $location.path("/admin/experts/"+user_pk);
								 }								 
							 },
							 function(data){
								 $scope.error = "Can't update profile" ;
							 });
	}
}])


.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/admin/experts', {
						 templateUrl: _TRGEN_HTML('/static/admin_app/experts/list.html'),
						 controller: 'expertsCtrl'
					 })
					 .when('/admin/experts/create/new', {
						 templateUrl: _TRGEN_HTML('/static/admin_app/experts/create_update.html'),
						 controller: 'expertsCreateCtrl'
					 })
					 .when('/admin/experts/:pk', {
						 templateUrl: _TRGEN_HTML('/static/admin_app/experts/create_update.html'),
						 controller: 'expertsUpdateCtrl'
					 })

					 ;
				 }])
				 
;
