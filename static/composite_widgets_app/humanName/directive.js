angular.module("uiCompositeWidgets")

.directive('cwHumanName', ["const", function( c ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			human:'=',
			hideDeleteBtn:'=?',
			hideBottomBtns:'@?',
			kioskMode:'=?',
			onDelete: '&?',
			label:'@?'
		},
		controller: function($scope) {
			$scope.const = c ;
			if (!$scope.human){ $scope.human = {} ; }

			if (!$scope.human.hasOwnProperty('family')){
				//
				//	Инициализация структуры
				//	https://fhir-ru.github.io/datatypes.html#HumanName
				//
				$scope.human.use = 'usual';
				$scope.human.text = '' ;
				$scope.human.family = [] ;
				$scope.human.given = [] ;
				$scope.human.prefix = [] ;
				$scope.human.suffix = [] ;
				$scope.human.period = null ;

				$scope.showEdit = true;
			}
			if (!$scope.human.period){
				$scope.human.period = {start: true, end: true} ;
			}			
			//
			//	Сохраняем бекап и обновляем каждый раз как 
			//	нажимается кнопка EDIT
			//
			$scope.backup=angular.copy($scope.human);

			$scope.$watch('showEdit', function(show) {
				if(show){
					$scope.backup = angular.copy($scope.human) ;
				}
			});


			$scope.cancel = function(){
				$scope.showEdit=false;
				if (!$scope.backup.family[0].length || !$scope.backup.given[0].length){
					$scope.onDelete();
					return;
				}
			
				$scope.human=angular_helpers.copy($scope.human, $scope.backup);
			}
			$scope.showEditMode = function(){
				$scope.showEdit = true ;
			}
			$scope.hideEditMode = function(){
				$scope.showEdit= false ;
			}

		},
		templateUrl: '/static/composite_widgets_app/humanName/humanName.html'
	};
}])


.directive('cwHumanNameView', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			ngDisabled: '=?'
		},
		controller: function($scope) {
		},
		template: '<span ng-if="ngModel.prefix">{{ngModel.prefix[0]}} </span>{{ngModel.given[0]}} {{ngModel.family[0]}} {{ngModel.suffix[0]}}'
	};
}])


;
