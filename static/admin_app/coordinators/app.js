//
//
//
//		MODULE:::
//
//
//
angular.module('SO_Admin')

.controller("coordinatorsCtrl", ["$scope","$location", "$routeParams", "djRest", 
						function($scope, $location, $routeParams, djRest) {
	$scope.coordinator_list = [] ;
	function getCoordinatorList(){
		$scope.loading = true ;
		djRest.Coordinators.query(function(data){
			$scope.coordinator_list = data ;
		},
		function(data){
			$scope.error = "Can't fetch info=(";
		});
	}

	getCoordinatorList();
	
	$scope.delete = function(pk){
		djRest.Coordinators.delete({pk:pk},
								   function(data){
									   getCoordinatorList();
								   },
								   function(data){
									   $scope.error = "Can't delete coordinator. Try again later." ;
								   });
	}
}])

.controller("coordinatorsCreateCtrl", ["$scope","$location", "djRest",  
						function($scope, $location, djRest) {
	$scope.create_new = true ;
	$scope.coordinator = {send_email:false} ;

	$scope.create = function(){
		var coordinator = new djRest.Coordinators($scope.coordinator);
		coordinator.$save(function(data){
			$location.path("/admin/coordinators");
		},
		function(data){
			$scope.error = "Can't save user. Try again later." ;
		});
	}
}])

.controller("coordinatorsUpdateCtrl", ["$scope","$location", "djRest", "$routeParams", 
						function($scope, $location, djRest, $routeParams) {
	$scope.coordinator = {send_email:false} ;
	$scope.loading = true;
	djRest.Coordinators.get({pk:$routeParams.pk},
							function(data){
								$scope.loading = false ;
								$scope.coordinator = data ;
							},
							function(data){
								$scope.error = "Can't fetch this user";
								$scope.loading = false ;
							});

}])


.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/admin/coordinators', {
						 templateUrl: _TRGEN_HTML('/static/admin_app/coordinators/list.html'),
						 controller: 'coordinatorsCtrl'
					 })
					 .when('/admin/coordinators/create/new', {
						 templateUrl: _TRGEN_HTML('/static/admin_app/coordinators/create_update.html'),
						 controller: 'coordinatorsCreateCtrl'
					 })
					 .when('/admin/coordinators/:pk', {
						 templateUrl: _TRGEN_HTML('/static/admin_app/coordinators/create_update.html'),
						 controller: 'coordinatorsUpdateCtrl'
					 })

					 ;
				 }])
				 
;
