angular.module("uiSmallWidgets",[])

.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    })

.filter('chunk', function () {
		return  function(arr, size) {
			var newArr = [];
			for (var i=0; i<arr.length; i+=size) {
				newArr.push(arr.slice(i, i+size));
			}
			return newArr;
		}
	})
.filter('splitArrayFilter', function() {
	return function(list, n) {
		var grid = [], i = 0, x = list.length, col, row = -1;
		for (var i = 0; i < x; i++) {
			col = i % n;
			if (col === 0) {
				grid[++row] = [];
			}
			grid[row][col] = list[i];
		}
		return grid;
	}
})

.filter('htmlUnsafe', ['$sce', function ($sce) { 
    return function (text) {
        return $sce.trustAsHtml(text);
    };    
}])


.filter('urlUnsafe', ['$sce', function ($sce) {
	return function(url) {
		return $sce.trustAsResourceUrl(url);
	};
}])

.filter('varToText', [function () {
	return function(text) {
		//	Разделяет строку по символам в верхнем регистре и объединяет их потом пробелами
		//
		//
		if (!text) return '';
		var list=text.match(/[A-Z][a-z]+/g);
		var new_text='';
		if (list.length==1){
			return text;
		}
		for (var t in list){
			new_text=new_text+list[t]+" ";
		}
		return new_text;
	};
}])

.filter('splitByRN', [function () { 
    return function (text) {
		if (!text){ return ''; }
		var re = new RegExp('/\\r', 'g');
		var text2=text.replace(re, '\n');
		var lines=text2.split("\n");
		if (!lines[lines.length-1]){
			lines.splice(lines.length-1,1);
		}
		return lines;
    };    
}])
.directive('textViewer', [ "$http", "$filter", function( $http, $filter ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=?',
			fromUrl:'@?'
		},
		controller: function($scope) {
			$scope.$watch('ngModel', function(ngModel) {
				$scope.lines=$filter('splitByRN')(ngModel);
			});
			$scope.$watch('fromUrl', function(fromUrl) {
				if ($scope.fromUrl){
					$scope.loading = true ;
					$http.get($scope.fromUrl).
						success(function(data, status, headers, config){
						$scope.ngModel = data;
						$scope.loading = false ;
					});
				}
			});


		},
		templateUrl: '/static/widgets_app/smallWidgets/textViewer.html'
	};
}])

.directive('checkbox', [ function( ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			label:'=',
			reverse: '=?',
			checkboxClass: '=?',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			var now = new Date();

			$scope.name = window.btoa($scope.label.substring(0,3))+now.getTime()+Math.random();

			if ($scope.reverse==undefined){
				$scope.reverse = false ;
			}
			if (!$scope.checkboxClass){
				$scope.checkboxClass = 'checkbox-default';
			}
		},
		templateUrl: '/static/widgets_app/smallWidgets/checkbox.html'
	};
}])

.directive('radiobutton', [ function( ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			name:'=',
			model:'=',
			label:'@',
			value:'=',
			ngDisabled: '=?'
		},
		controller: function($scope) {
		},
		templateUrl: '/static/base_app/radiobutton.html'
	};
}])

.directive('error', [function(){
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
		},
		controller: function($scope) {
			$scope.hide_error = function(){
				$scope.ngModel = '';
			}
		},
		template:'<div class="alert alert-dismissible alert-danger" ng-show="ngModel">'+
				'<button type="button" class="close" ng-click="hide_error()">×</button>'+
				'<strong>Oh snap!</strong> {{ngModel}}'+
				'</div>'
	};

}])

.directive('bsCheckbox', [function(){
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			label:'@'
		},
		controller: function($scope) {
			$scope.hide_error = function(){
				$scope.ngModel = '';
			}
		},
		template:'<div class="checkbox">'+
                    '<label>'+
                        '<input type="checkbox" ng-model="ngModel">{{label}}'+
                    '</label>'+
                '</div>'
	};

}])



.directive('constSelect', ["const", function(c){
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=',
			modelType:'@',
			ngDisabled:'=?',
			sClass:'@'
		},
		controller: function($scope) {
			$scope.const = c ;
			$scope.getTypeDict = function(){
				return $scope.const.MODEL_TYPES[$scope.modelType];
			}
			if (!$scope.sClass){
				$scope.sClass = 'input-sm';
			}
		},
		template:
			'<md-select ng-model="ngModel"'+
				'ng-disabled="ngDisabled" required="required">'+
				'<md-option ng-repeat="(key, value) in getTypeDict()" value="{{value}}">'+
					'{{key}}'+
				'</md-option>'+
			'</md-select>'
	};

}])



.directive('lineEditDeleteBtns', [ function(){
	//
	//
	return {
		restrict: 'E',
		scope: {
			showEdit:'=',
			label:'@',
			onDelete:'&?',
			ngDisabled:'=?',
			hideDeleteBtn:'='
		},
		controller: function($scope) {
		},
		templateUrl: '/static/widgets_app/smallWidgets/lineEditDeleteBtns.html'
	};
}])


.directive('lineViewDeleteBtns', [ function(){
	//
	//
	return {
		restrict: 'E',
		scope: {
			label:'@',
			onDelete:'&',
			url: '@',
		},
		controller: function($scope) {
		},
		templateUrl: '/static/widgets_app/smallWidgets/lineViewDeleteBtns.html'
	};
}])


.directive('line', [ function(){
	//
	//
	return {
		restrict: 'E',
		scope: {
			label:'@',
		},
		controller: function($scope) {
		},
		template:
'<style>'+
'.line{'+
	'text-align: right;'+
	'margin-bottom: 0em;'+
	'margin-top: 1.3em;'+
	'box-shadow: -2px -3px 2px -2px #2196F3;'+
	'height:2.5em;'+
'}'+
'</style>'+
'<div class="line">'+
	'<label ng-if="label" style="font-weight: bolder;margin-right:1em;">'+
		'{{label}}'+
	'</label>'+
'</div>'
	};
}])

.directive('picturePicker', [ function(){
	//
	//
	return {
		restrict: 'E',
		scope: {
			image:'=',
			kioskMode:'=?',
			defaultUrl:'@?'
		},
		controller: function($scope) {

		},
		templateUrl: '/static/widgets_app/smallWidgets/picturePicker.html'
	};
}])


.directive('listObjsManagement', ["const", function(c){
	//
	//
	return {
		restrict: 'E',
		scope: {
			listObjs:'=',
			defaultObj:'@',
			helpText: '@',
			constType: '@'
		},
		controller: function($scope) {
			$scope.const = c;
			$scope.newObj = angular.copy($scope.defaultObj) ;
			$scope.customObj = '';
			
			$scope.addObj = function(){
				$scope.listObjs.push($scope.newObj);
			}

			$scope.removeObj = function(obj){
				var index=$scope.listObjs.indexOf(obj);
				if (index>-1){
					$scope.listObjs.splice(index,1);
				}
			}

			$scope.isObjInList = function(obj){
				return $scope.listObjs.indexOf(obj)>-1;
			}

			$scope.addCustomObj = function(){
				$scope.listObjs.push($scope.customObj);
				$scope.customObj='';
			}

		},
		templateUrl: '/static/widgets_app/smallWidgets/listObjsManagement.html'
	};
}])


.directive('viewObj', [ function(){
	//
	//
	return {
		restrict: 'E',
		scope: {
			obj:'=',
			fields:'@?',
			fieldsName:'@',
			textFields: '@?' //тут только текстовые поля чтоб не тестировать их
							//на принадлежность url, email,
							//они должны присутствовать и в fields
		},
		controller: function($scope) {
			if (!$scope.textFields){
				$scope.textFields = '';
			}
			//
			//		Функции для нахождения типа поля
			//
			$scope.fields=$scope.fields.split(',');
			$scope.textFields = $scope.textFields.split(',') ;
			$scope.fieldsName=JSON.parse($scope.fieldsName);
			function isDateTime(value){
				try{
					var v=moment(value);
					if (v._d=='Invalid Date'){
						return false;
					}
					return true;
				}
				catch(e){
					return false;
				}
			}
			function isBool(value){
				return typeof(value)=='boolean';
			}
			function isEmail(value){
				var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
				return re.test(value);
			}
			function isUrl(value){
				if (value.indexOf("http://")>-1){
					return true;
				}
				if (value.indexOf('www.')>-1){
					return true;
				}
				return false;
			}
			function isPeriod(value){
				if (typeof(value)=='object'){
					if (value.hasOwnProperty('start') || value.hasOwnProperty('end')){
						return true;
					}
				}
				return false;
			}
			function getValueType(value){
				if ($scope.textFields.indexOf(value)>-1){
					return 'text';
				}
				if (isPeriod(value)){
					return 'period';
				}
				if (isDateTime(value)){
					return 'datetime';
				}
				if (isBool(value)){
					return 'bool';
				}
				if (isEmail(value)){
					return 'email';
				}
				if (isUrl){
					return 'url';
				}
				return 'text';
			}



			function composeFields(raw_obj){
				var obj_list=[], field, field_type, obj, value;
				if (!raw_obj){
					$scope.obj_list = [] ;
					return;
				}
				for (var i = 0; i < $scope.fields.length; i++) {
					field=$scope.fields[i];
					value=raw_obj[field];
					if (value==null || value==undefined){
						continue;
					}
					field_type=getValueType(value);
					obj={
						'type': field_type,
						'name': field,
						'value': value 
					};
					obj_list.push(obj);
				};
				$scope.obj_list = obj_list;
			}

			
			$scope.$watch('obj', function(raw_obj) {
				composeFields(raw_obj);
			}, true);

			composeFields($scope.obj);

		},
		templateUrl: '/static/widgets_app/smallWidgets/viewObj.html'
	};

}])




.directive('spinnerLoader', [ function( ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngShow:'=',
			label:'@?'
		},
		controller: function($scope) {
		},
		templateUrl: '/static/widgets_app/smallWidgets/spinnerLoader.html'
	};
}])



.directive('datetimePicker', [ function( ) {
	//
	//
	//
	//
	//
        return {
            require: '?ngModel',
            restrict: 'AE',
            scope: {
                pick12HourFormat: '@',
                locale: '@',
                useCurrent: '@',
                location: '@',
				sideBySide: '@',
				date:'=',
				minDate:'=?',
				ngDisabled: '=?',
            },

            link: function (scope, elem, attrs) {
				scope.elem=elem;
				scope.skip_apply=false;
				scope.skip_apply_date=false;

				/*
				scope.$watch('ngDisabled', function(disable) {
					console.log(disable);
					if (disable){
						$(elem).css('background','red');
						//elem.data("DateTimePicker").hide();	
					}
					else{
						elem.data("DateTimePicker").show();	
					}
				});
				*/

				if (scope.minDate){
					elem.datetimepicker({
						pick12HourFormat: scope.pick12HourFormat,
						language: scope.locale,
						inline: true,
						sideBySide: scope.sideBySide,
						minDate: scope.minDate,
						maxDate: moment().add(50, 'years'),
						useCurrent: scope.useCurrent
					});
				}
				else{
					elem.datetimepicker({
						pick12HourFormat: scope.pick12HourFormat,
						language: scope.locale,
						inline: true,
						sideBySide: scope.sideBySide,
						maxDate: moment().add(50, 'years'),
						useCurrent: scope.useCurrent
					});		
				}

				var skip_min_date=false;
				scope.$watch('minDate', function(date) {
					if (date==undefined || date ==null){ 
						elem.data("DateTimePicker").minDate(false);
						return;
					}
					if (!skip_min_date){
						skip_min_date=true;
						elem.data("DateTimePicker").minDate(moment(date));
					}
					skip_min_date=false;
					if (moment(date).isAfter(scope.date)){
						scope.skip_apply=true;
						scope.date=moment(date).toISOString();
					}
				}, true);	

				scope.$watch('date', function(date){
					if (!date){ return; }
					
					elem.data("DateTimePicker").date(moment(date));
				});

                //Local event change
				elem.on('dp.change', function (e) {
					if (skip_min_date){
						scope.skip_apply=false;
						skip_min_date=false;
						return;
					}
					var date=e.date.toISOString();
					scope.$apply(function(){
						scope.date=date;
					});
				});
			}
        }

}])


.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}])
//
//		Directives
//
//
.directive('fileModel', ['$parse', function ($parse) {
	//
	//	Binding html input-file to ng-model
	//
	//
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])

.directive("passwordVerify", function() {
   return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.passwordVerify || ctrl.$viewValue) {
               combined = scope.passwordVerify + '_' + ctrl.$viewValue; 
            }                    
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.passwordVerify;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("passwordVerify", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("passwordVerify", true);
                        return viewValue;
                    }
                });
            }
        });
     }
   };
})

.directive('easyPassword', ["$q", "$http", function($q, $http) {
	return {
		restrict: 'AE',
		require: 'ngModel',
		link: function(scope, elm, attr, model, ctrl) { 
			model.$validators.easyPassword = function() { 
				var n=Number(model.$$rawModelValue);
				if (isNaN(n) && model.$$rawModelValue.length>4){ return true; }
				return false;
			};
		}
	} 
}])

;
