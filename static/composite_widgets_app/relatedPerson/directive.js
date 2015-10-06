angular.module("uiCompositeWidgets")

.directive('cwRelatedPerson', [ function( ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			person:'=',
			onSave:'&?',
			label:'@?',
			btnSaveLabel: '@?'
		},
		controller: function($scope) {
			$scope.form = {valid: true};
			

			$scope.deleteContact = function(index){
				$scope.person.telecom.splice(index,1);
			}

			$scope.deleteAddress = function(){
				$scope.person.address = null;
			}


			function validatePerson(person){
				var v={
					valid: true,
					error:{}
				};
				//
				//	Валиден ли адрес (все ли поля введены?)
				//
				if (person.address){
					var line=person.address.line;
					if (!line){ line=['']; }
					if (!line[0]){line=[''];}
					if (!person.address.city || !person.address.country || !line[0].length){
						v.valid=false;
						v.error.address=true;
					}
				}
				//
				//	Валидны ли все блоки с контактными данными
				//
				if (person.telecom.length){
					var invalid_n=[], value;
					for (var i = 0; i < person.telecom.length; i++) {
						value=person.telecom[i].value;
						if (!value){
							invalid_n.push(i);
						}
					};
					if (invalid_n.length){
						v.valid=false;
						v.error.telecom=invalid_n;
					}
				}
				//
				//	Введена ли хоть одна строка из relationship
				//
				if (!person.relationship.length){
					v.valid=false;
					v.error.relationship=true;
				}
				//
				//	Введены ли имя и фамилия
				//
				if (person.name){
					if (!person.name.given[0] || !person.name.family[0]){
						v.valid=false;
						v.error.name=true;
					}
				}
				console.log("==========");
				console.log(v);
				$scope.form = v;
			}

			$scope.$watch('person', function(person) {
				validatePerson(person);
			}, true);

			validatePerson($scope.person);

		},
		templateUrl: '/static/composite_widgets_app/relatedPerson/relatedPerson.html'
	};
}])


.directive('cwRelatedPersonView', [ function( ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			person:'=',
			showLabel:'@?',
		},
		controller: function($scope) {
		},
		templateUrl: '/static/composite_widgets_app/relatedPerson/relatedPersonView.html'
	};
}])



.directive('cwRelatedPersonSmallView', ["const", function(c) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			person:'=',
			onDelete:'&',
			url:'@'
		},
		controller: function($scope) {
			$scope.const = c ;
			$scope.$watch('person.telecom', function(telecom) {
				var contact_line="";
				var max=2;
				for (var i = 0; i < telecom.length; i++) {
					if (telecom[i].system=="phone" || telecom[i].system=="email"){
						if (i>max){
							break;
						}
						contact_line=contact_line+" / "+telecom[i].value;
					}
				};
				if (contact_line){
					$scope.contact_line = contact_line;
				}
				
			}, true);
		},
		templateUrl: '/static/composite_widgets_app/relatedPerson/relatedPersonSmallView.html'
	};
}])





;
