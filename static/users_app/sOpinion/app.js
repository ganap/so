//
//
//
//
//
//
angular.module('SO_UserProfile')
.controller("soHelperCtrl", ["$scope","$location", "userProfile", "djRest","sOpinion", 
						function($scope, $location, userProfile, djRest, sOpinion) {
	$scope.sOpinion = sOpinion;
	$scope.queue = {};

	function collectSO(list){
		if (!list) return [];
		var new_list=[];
		for (var i = 0; i < list.length; i++) {
			if(list[i].user==userProfile.user.pk){
				new_list.push(list[i])
			}
		};
		return new_list;
	}
	$scope.$watch('sOpinion.queue', function(queue) {
		$scope.queue = {
			opened: collectSO(queue.opened),
			in_progress: collectSO(queue.in_progress),
			closed: collectSO(queue.closed)
		} ;
	}, true);

	$scope.queue = {
		opened: collectSO(sOpinion.queue.opened),
		in_progress: collectSO(sOpinion.queue.in_progress),
		closed: collectSO(sOpinion.queue.closed)
	} ;	
}])
.controller("viewSoCtrl", ["$controller","$scope", "userProfile", "djRest",
			function($controller,$scope, userProfile, djRest) {

	//наследование
	$controller('soHelperCtrl', {
                $scope: $scope
    });
	$scope.loading =true ;
	$scope.userProfile = userProfile ;
	djRest.SOpinion.own(function(data){
		$scope.so_cases = data;
		$scope.loading = false ;
		
	},
	function(){
		$scope.loading = false ;
		$scope.error = "Can't download info" ;
	});

	$scope.markAsViewed = function(so_pk){
		djRest.SOpinion.delete({pk:so_pk});
	}

}])

.controller("requestSoCtrl", ["$scope","$location", "userProfile", "djRest", 
						function($scope, $location, userProfile, djRest) {
	$scope.userProfile = userProfile ;
	
}])
.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/patient/so', {
						 templateUrl: _TRGEN_HTML('/static/users_app/sOpinion/list.html'),
						 controller: 'viewSoCtrl'
					 })
					 .when('/patient/so/request', {
						 templateUrl: _TRGEN_HTML('/static/users_app/sOpinion/request.html'),
						 controller: 'requestSoCtrl'
					 })					 
					 ;
				 }])
				 
;
