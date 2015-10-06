angular.module("uiCompositeWidgets")

.directive('cwAddress', ["const", function( c ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			address:'=',
			hideDeleteBtn:'=?',
			hideBottomBtns:'@?',
			kioskMode:'=?',
			onDelete: '&?',
			label:'@?'
		},
		controller: function($scope) {
			$scope.const = c ;
			if (!$scope.address){ $scope.address = {} ; }

			if (!$scope.address.hasOwnProperty('line')){
				//
				//	Инициализация структуры
				//	https://fhir-ru.github.io/datatypes.html#Address
				//
				$scope.address.use = 'home';
				$scope.address.type_ = 'physical';
				$scope.address.line = [];
				$scope.address.city = '';
				$scope.address.state = '';
				$scope.address.country = '';
				$scope.address.postalCode = '';

				$scope.showEdit = true;
			}
			if (!$scope.address.period){
				$scope.address.period = {start: true, end: true} ;
			}
			//
			//	Сохраняем бекап и обновляем каждый раз как 
			//	нажимается кнопка EDIT
			//
			$scope.backup=angular.copy($scope.address);

			$scope.$watch('showEdit', function(show) {
				if(show){
					$scope.backup = angular.copy($scope.address) ;
				}
			});


			$scope.cancel = function(){
				$scope.showEdit=false;
				if (!$scope.backup.city.length || 
					!$scope.backup.country.length ||
				    !$scope.backup.line[0].length){
					$scope.onDelete();
					return;
				}
				$scope.address=angular_helpers.copy($scope.address, $scope.backup);
			}
			$scope.showEditMode = function(){
				$scope.showEdit = true ;
			}
			$scope.hideEditMode = function(){
				$scope.showEdit= false ;
			}
		},
		templateUrl: '/static/composite_widgets_app/address/address.html'
	};
}])


.directive('cwAddressView', ["const", function( c ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			address:'='
		},
		controller: function($scope) {
			$scope.const = c ;
		},
		templateUrl: '/static/composite_widgets_app/address/addressView.html'
	};
}])


;
