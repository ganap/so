angular.module("uiCompositeWidgets")


.directive('cwExpertViewSimple', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			expert:'=',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			
		},
		templateUrl: '/static/composite_widgets_app/expert/cwExpertViewSimple.html'
	};
}])


;
