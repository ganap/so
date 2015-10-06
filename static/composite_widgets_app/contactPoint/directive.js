angular.module("uiCompositeWidgets")

.directive('cwContactPoint', ["const", function( c ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			contact:'=',
			hideDeleteBtn:'=?',
			hideBottomBtns:'@?',
			kioskMode:'=?',
			onDelete:'&?',
			label:'@?'
		},
		controller: function($scope) {
			$scope.const = c ;

			if (!$scope.contact){ $scope.contact = {} ; }

			if (!$scope.contact.value){
				//
				//	Инициализация структуры
				//
				$scope.contact.system='phone';
				$scope.contact.use = 'home' ;
				$scope.contact.period = null ;
				$scope.contact.value = null;

				$scope.valuePlaceholder = 'Phone';
				$scope.showEdit = true;
			}
			//
			//	Сохраняем бекап и обновляем каждый раз как 
			//	нажимается кнопка EDIT
			//
			$scope.backup=$scope.contact;

			$scope.$watch('showEdit', function(show) {
				if(show){
					$scope.backup = angular.copy($scope.contact) ;
				}
			});
			//
			//

			$scope.$watch('contact.system', function(system) {
				if (system=='email'){
					$scope.valuePlaceholder="Email";
				}
				if (system=='phone'){ $scope.valuePlaceholder = 'Phone' ; }
				if (system=='fax'){ $scope.valuePlaceholder = 'Fax' ; }
				if (system=='url'){ $scope.valuePlaceholder = 'Url' ; }
			});


			$scope.cancel = function(){
				$scope.showEdit=false;
				if (!$scope.backup.value){
					$scope.onDelete();
					return;
				}
				$scope.contact=angular_helpers.copy($scope.contact, $scope.backup);
			}
			$scope.showEditMode = function(){
				$scope.showEdit = true ;
			}
			$scope.hideEditMode = function(){
				$scope.showEdit= false ;
			}

		},
		templateUrl: '/static/composite_widgets_app/contactPoint/contactPoint.html'
	};
}])


.directive('cwContactPointView', ["const", function( c ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			contact:'='
		},
		controller: function($scope) {
			$scope.const = c ;

			$scope.$watch('contact.system', function(system) {
				if (system=='email'){
					$scope.valuePlaceholder="Email";
				}
				if (system=='phone'){ $scope.valuePlaceholder = 'Phone' ; }
				if (system=='fax'){ $scope.valuePlaceholder = 'Fax' ; }
				if (system=='url'){ $scope.valuePlaceholder = 'Url' ; }
			});
		},
		templateUrl: '/static/composite_widgets_app/contactPoint/contactPointView.html'
	};
}])

;
