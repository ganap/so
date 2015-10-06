//
//
//
//		MODULE:::
//
//
//
angular.module('uiFhirDocs')



.directive('fdCondition', [ 'const', function(c) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			editMode: '=?',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			var skip_apply = false;
			$scope.const = c ;

			function fixCondition(condition){
				if (!condition) return;
				//	не все поля правильно называются. 
				//	согласно https://fhir-ru.github.io/condition.html
				if(condition.hasOwnProperty('status')){
					condition.clinicalStatus=condition.status;
				}
				skip_apply=true;
				return condition;
			}
			$scope.ngModel = fixCondition($scope.ngModel);

			$scope.$watch('ngModel', function(ngModel) {
				if (!skip_apply){
					skip_apply=false;
					$scope.ngModel = fixCondition(ngModel);
				}
			}, true);
			
		},
		templateUrl: '/static/fhir_docs_app/Condition/fdCondition.html'
	};
}])


.directive('fdConditionSummary', ["$location", "$controller",  function($location, $controller) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			bundle:'=',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			//$scope.viewMode = false;
			$controller('editViewBtn', {
				$scope: $scope
			});
			$scope.fhirDocTitle = 'Condition';
			$scope.searchKey = 'health_record' ;
			$scope.templateUrl = '/static/fhir_docs_app/Condition/fdConditionSummary.html' ;

			$scope.$watch('bundle', function(bundle) {
				var entry=bundle.entry;
				if (!entry.length){
					$scope.latest_condition = {} ;
					$scope.error = "No condition available." ;
					return;
				}
				$scope.latest_condition = entry[entry.length-1].content;
				$scope.error = '' ;
			}, true);
			
		},
		templateUrl: '/static/fhir_docs_app/basic/fdSummary.html'
	};
}])




;
