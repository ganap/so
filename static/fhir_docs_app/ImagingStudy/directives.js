//
//
//
//		MODULE:::
//
//
//
angular.module('uiFhirDocs')


.directive('fdImagingStudy', [ 'const', function(c) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			editMode: '=?',
			currentAttachment:'=',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			var skip_apply = false;
			$scope.const = c ;

			function fixObservation(observation){
				if (!observation) return;
				return observation;
			}
			$scope.ngModel = fixObservation($scope.ngModel);

			$scope.$watch('ngModel', function(ngModel) {
				if (!skip_apply){
					skip_apply=false;
					$scope.ngModel = fixObservation(ngModel);
				}
			}, true);

			$scope.setCurrentAttachment = function(attachment){
				console.log('SET CURRENT');
				angular_helpers.copy($scope.currentAttachment, attachment)
				//$scope.currentAttachment = attachment;
			}
			
		},
		templateUrl: '/static/fhir_docs_app/ImagingStudy/fdImagingStudy.html'
	};
}])


.directive('fdImagingStudySummary', ["$location", "$controller",  function($location, $controller) {
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
			$scope.fhirDocTitle = 'ImagingStudy';
			$scope.searchKey = 'health_record' ;
			$scope.templateUrl = '/static/fhir_docs_app/ImagingStudy/fdImagingStudySummary.html' ;

			$scope.$watch('bundle', function(bundle) {
				var entry=bundle.entry;
				if (!entry.length){
					$scope.latest = {} ;
					$scope.error = "No Observation available." ;
					return;
				}
				$scope.latest = entry[entry.length-1].content;
				$scope.error = '' ;
			}, true);
			
		},
		templateUrl: '/static/fhir_docs_app/basic/fdSummary.html'
	};
}])





;
