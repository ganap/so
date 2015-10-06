angular.module('uiFhirDocs')

.controller("modalWindowEditObjCtrl", ["$scope", "$mdDialog", "const",  function($scope, $mdDialog, c) {
	//
	//	контроллер для модальных окон, который позволяет не трогая основную
	//	ngModel поменять свойства и если надо, то либо перезаписать
	//	модель новыми данными либо отменить это
	//
	//	ОБЯЗАТЕЛЬНО в дочернем контроллере должны быть переменные:
	//		ngModel
	//		ngModelEdit
	//		title	-	заголовок модального окна.
	//		templateUrl		-	полный путь к содержимому внутри диалогового окна
	//		onRemove	-	функция для удаления объекта
	//		show_delete		-	 в паре с предыдущей функцией
	//
	//	В ШАБЛОНЕ
	//		обращение к $scope идет через ctrl.parent
	//
	//	НАСЛЕДОВАНИЕ В ДОЧЕРНЕМ КОНТРОЛЛЕРЕ
	//		$controller('modalWindowEditObjCtrl', {
    //            $scope: $scope
    //       });
	//       //дальше можно дописывать поля и методы
	//		
	//
	$scope.const = c ;
	$scope.ngModelEdit=angular.copy($scope.ngModel);

	$scope.cancel=function(){
		angular_helpers.copy($scope.ngModelEdit, $scope.ngModel);
		$mdDialog.cancel();
	}
	$scope.done=function(){
		angular_helpers.copy($scope.ngModel, $scope.ngModelEdit);
		$mdDialog.cancel();
	}
	$scope.delete=function(){
		$scope.onRemove($scope.coding);
	}

	$scope.runEditDialog = function(){
		$mdDialog.show({
			templateUrl: '/static/fhir_docs_app/basic/modalWindowEditObjModal.html',
			parent: angular.element(document.body),
			controller: function () { this.parent = $scope; },
			controllerAs: 'ctrl',
			clickOutsideToClose:true
		});				
	}	

}])


.controller("editViewBtn", ["$scope", "$location", "const", function($scope, $location, c) {
	//	менеджмент кнопок для просмотра и редактирования
	//	карточки fhirDocSummary
	//
	//	ОБЯЗАТЕЛЬНО в дочернем контроллере должны быть переменные:
	//		fhirDocTitle	-	['Condition', 'Observation'] для октрытия 
	//						всех свойств на редактирование
	//		templateUrl		-	полный путь к части шаблона который вкладывается в карточку,
	//					в директиве templateUrl = '/static/fhir_docs_app/basic/fdSummary.html',
	//					именно в него будет включаться кусок шаблона.
	//	ОПЦИОНАЛЬНО
	//		onAddClick()	-	при нажатии на кнопку добаления нового элемента в карточку
	//
	$scope.const = c ;
	$scope.viewMode = false;
	$scope.onEditClick = function(){
		$location.search($scope.searchKey, $scope.fhirDocTitle)
	}
	$scope.onViewClick = function(){
		$scope.viewMode = !$scope.viewMode;
	}

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


}])

;
