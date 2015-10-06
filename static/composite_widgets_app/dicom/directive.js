angular.module("uiCompositeWidgets")

.directive('cwDicomView', [ function( ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			dicomUrl:'@'
		},
		controller: function($scope) {
		},
		templateUrl:"/static/composite_widgets_app/dicom/dicomView.html"
	};
}])

.directive('cwDicomInfoBtn', [ '$mdDialog', function($mdDialog) {
	//
	//
	//
	return {
		restrict: 'E',
		scope:{

		},
		controller: function($scope){
			/*
			$scope.showInfo = function(){
				$("#dicomBaseInfoModal").modal();
			}*/
			function dialogController(scope){
				$scope.tab = 'basic';
				scope.cancel = function() {
					$mdDialog.hide();
				};
			}
			$scope.showInfo = function(ev) {
				$mdDialog.show({
					controller: dialogController,
					templateUrl: '/static/composite_widgets_app/dicom/infoBtnModal.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true
				});
			}
		},
		templateUrl:"/static/composite_widgets_app/dicom/infoBtn.html"
	};
}])



.directive('cwDicomInvertBtn', [ function( ) {
	//
	//
	//
	return {
		restrict: 'E',
		controller: function($scope) {
			$scope.invert = function(){
				var element=$(".dicom-base-view-wrapper").children();
				element=$(element).get(0);
				var viewport = cornerstone.getViewport(element);
				if (viewport.invert === true) {
					viewport.invert = false;
				} else {
					viewport.invert = true;
				}
				cornerstone.setViewport(element, viewport);				
			}
		},
		template: 
'<button class="btn btn-default btn-sm" ng-click="invert()">'+
	'<span class="glyphicon glyphicon-adjust"></span>'+
	'INVERT'+
'</button>'
	};
}])

.directive('cwDicomInterpolationBtn', [ function( ) {
	//
	//
	//
	return {
		restrict: 'E',
		controller: function($scope) {
			$scope.interpolate = function(){
				var element=$(".dicom-base-view-wrapper").children();
				element=$(element).get(0);
				var viewport = cornerstone.getViewport(element);
				if (viewport.pixelReplication === true) {
					viewport.pixelReplication = false;
				} else {
					viewport.pixelReplication = true;
				}
				cornerstone.setViewport(element, viewport);
			}
		},
		template: 
'<button class="btn btn-default btn-sm" ng-click="interpolate()">'+
	'INTERPOLATION'+
'</button>'
	};
}])

.directive('cwDicomToolBtns', [ function( ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope:{
			activeTool:'@?'
		},
		controller: function($scope) {

			function deactivateAll(element){
				cornerstoneTools.probe.deactivate(element, 1);
				cornerstoneTools.length.deactivate(element, 1);
				cornerstoneTools.ellipticalRoi.deactivate(element, 1);
				cornerstoneTools.rectangleRoi.deactivate(element, 1);
				cornerstoneTools.angle.deactivate(element, 1);
				cornerstoneTools.highlight.deactivate(element, 1);
				cornerstoneTools.freehand.deactivate(element, 1);
			}

			function getViewportDiv(){
				var element=$(".dicom-base-view-wrapper").children();
				element=$(element).get(0);
				return element;
			}

			$scope.activate = function(tool){
				var element=getViewportDiv();
				deactivateAll(element);
				cornerstoneTools[tool].activate(element, 1);
				$scope.activeTool = tool;
			}
			$scope.clearTool = function(tool){
				var element=getViewportDiv();
				cornerstoneTools.clearToolState(element, tool);
				cornerstone.updateImage(element);
			}
			$scope.clearAllTools =function(){
				var tools=['length', 'probe', 'ellipticalRoi', 'rectangleRoi',
							'freehand', 'angle'];
				var element=getViewportDiv();
				for (var i = 0; i < tools.length; i++) {
					cornerstoneTools.clearToolState(element, tools[i]);
				};
				cornerstone.updateImage(element);
			}
		},
		templateUrl: '/static/composite_widgets_app/dicom/toolBtns.html'
	};
}])






;
