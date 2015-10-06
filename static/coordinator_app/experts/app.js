//
//
//
//		MODULE:::
//
//
//
angular.module('SO_Coordinator')

.controller("expertsCtrl", ["$scope","$location", "$routeParams", "djRest", "dialogsAndVideoIm", 
						function($scope, $location, $routeParams, djRest, dialogsAndVideoIm) {
	$scope.dialogsAndVideoIm = dialogsAndVideoIm ;
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
	
}])


.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/coordinator/experts', {
						 templateUrl: _TRGEN_HTML('/static/coordinator_app/experts/list.html'),
						 controller: 'expertsCtrl'
					 })


					 ;
				 }])
				 
;
