//
//
//
//		MODULE:::
//
//
//
angular.module('uiFhirDocs')

.directive('fdCoding', ['$mdDialog', '$controller', function($mdDialog, $controller) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			editMode: '=?',
			onRemove: '&?',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			$controller('modalWindowEditObjCtrl', {
                $scope: $scope
  	        });
			$scope.title = 'Code' ;
			$scope.templateUrl = '/static/fhir_docs_app/basic/fdCodingModal.html' ;
			/*
			$scope.coding=angular.copy($scope.ngModel);

			$scope.cancel=function(){
				angular_helpers.copy($scope.coding, $scope.ngModel);
				$mdDialog.cancel();
			}
			$scope.done=function(){
				angular_helpers.copy($scope.ngModel, $scope.coding);
				$mdDialog.cancel();
			}
			$scope.delete=function(){
				$scope.onRemove($scope.coding);
			}

			$scope.runEditDialog = function(){
				$mdDialog.show({
					templateUrl: '/static/fhir_docs_app/basic/fdCodingModal.html',
					parent: angular.element(document.body),
					controller: function () { this.parent = $scope; },
					controllerAs: 'ctrl',
					clickOutsideToClose:true
				});				
			}
			*/

		},
		templateUrl: '/static/fhir_docs_app/basic/fdCoding.html'
	};
}])

.directive('fdCodebleConcept', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			codableConcept:'=ngModel',
			editMode: '=?',
			ngDisabled: '=?'
		},
		controller: function($scope) {
		},
		templateUrl: '/static/fhir_docs_app/basic/fdCodebleConcept.html'
	};
}])
.directive('fdTiming', ["const", function( c ) {
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
			$scope.const = c ;
		},
		templateUrl: '/static/fhir_docs_app/basic/fdTiming.html'
	};
}])




.directive('fdDate', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			ngDisabled: '=?'
		},
		link: function($scope, element){
			var skip_apply=false;
			var i=element.find('input');
			i.prop('disabled', true);

			function fixDate(date){
				if (typeof(date=='string')){
					skip_apply=true;
					$scope.ngModel = moment(date).toISOString();
				}
			}
//			fixDate($scope.ngModel);
			skip_apply=false;
//			$scope.$watch('ngModel', function(ngModel) {
//				if (!skip_apply){
					skip_apply=false;
					//fixDate(ngModel);
//				}
//			});
		},
		templateUrl: '/static/fhir_docs_app/basic/fdDate.html'
	};
}])

.directive('fdDateButton', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			editMode:'=?',
			ngDisabled: '=?'
		},
		link: function($scope, element){
			if ($scope.editMode==undefined){
				$scope.editMode = false;
			}
		},
		templateUrl: '/static/fhir_docs_app/basic/fdDateButton.html'
	};
}])





.directive('fdValueQuantity', ["$controller", function( $controller ) {
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
			//https://fhir-ru.github.io/datatypes.html#Quantity
			$controller('modalWindowEditObjCtrl', {
                $scope: $scope
  	        });

			$scope.title = 'Quantity' ;
			$scope.templateUrl = '/static/fhir_docs_app/basic/fdValueQuantityModal.html' ;		
		},
		templateUrl: '/static/fhir_docs_app/basic/fdValueQuantity.html'
	};
}])

.directive('fdValueQuantityView', [ "const", function(c) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
		},
		controller: function($scope) {	
			$scope.const = c ;
		},
		template: "{{const.getKeyByVal('QUALITY_COMPARATOR_TYPES',ngModel.comparator)}} {{ngModel.value}} {{ngModel.units}}"
	};
}])

.directive('fdRelated', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			bundle:'=',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			$scope.getIndexByTitle = function(title){
				var index=-1;
				for (var i = 0; i < $scope.bundle.entry.length; i++) {
					if ($scope.bundle.entry[i].title==title){
						index=i;
						break;
					}
				};
				return index;
			};			
		},
		template: "<b> Related to: </b>"+
				  '<span ng-repeat="related in ngModel">#{{getIndexByTitle(related.target.reference)+1}}'+
						'<span ng-if="ngModel.length>0 && $index<ngModel.length-1">, </span>'+
				  '</span>'
	};
}])


;
