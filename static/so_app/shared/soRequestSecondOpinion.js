angular.module('SO_SecondOpinion')

.directive('soRequestSecondOpinion', [ "djRest", function(djRest) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			userPk:'=',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			$scope.tab = 'diagnosis' ;
			$scope.request_info = {};

			$scope.saveAndPay = function(){
				$scope.tab = 'save' ;				
				$scope.loading = true ;
				var so_request = new djRest.SOpinion($scope.request_info);
				so_request.$save(function(data){
					$scope.show_paypal = true;
					$scope.loading = false ;
				},
				function(data){
					$scope.loading = false ;
					$scope.error = "Cant send request. Try again later.";
				});
			}
				
		},
		templateUrl: '/static/so_app/shared/soRequestSecondOpinion.html'
	};
}])

