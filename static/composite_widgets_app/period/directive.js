angular.module("uiCompositeWidgets")

.directive('cwPeriod', [ function( ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			period:'=',
			label:'@?'
		},
		controller: function($scope) {
			$scope.disable = {start:true, end:true};

			$scope.$watch('period', function(period) {
				if (period==null){ $scope.disable={start: true, end: true};return; }
				if (typeof(period.start)=='string'){
					$scope.disable.start = false;
				}
				else{
					$scope.disable.start = true;
				}
				if (typeof(period.end)=='string'){
					$scope.disable.end = false;
				}
				else{
					$scope.disable.end = true;
				}
			}, true);

			$scope.$watch('disable', function(disable) {
				if (disable.start && disable.end){
					$scope.use_period = false;
				}
				else{
					$scope.use_period = true;
				}
				if ($scope.period==null){ $scope.disable={start: true, end: true};return; }
				if (disable.start){
					$scope.period.start = null;
				}
				if (disable.end){
					$scope.period.end = null;
				}
			}, true);
		},
		templateUrl: '/static/composite_widgets_app/period/period.html'
	};
}])


.directive('cwPeriodView', [ function( ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			period:'=',
		},
		controller: function($scope) {
		},
		template:
		'<span ng-show="period.start.length">'+
			'<b> From </b>'+ 
			"<span class='text-primary'>{{period.start | date: 'MMM d, y h:mm:ss a'}};</span>"+
		'</span>'+
		'<span ng-show="period.end.length">'+
			'<b> Until </b>'+ 
			"<span class='text-primary'>{{period.end | date: 'MMM d, y h:mm:ss a'}};</span>"+
		'</span>'
	};
}])




;
