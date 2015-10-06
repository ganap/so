angular.module('uiBirthdayPicker', [])


.filter('uiBirthdayPickerMakeRange', function() {
	return function(input) {
		var lowBound, highBound;
		switch (input.length) {
			case 1:
				lowBound = 0;
			highBound = parseInt(input[0]) - 1;
			break;
			case 2:
				lowBound = parseInt(input[0]);
			highBound = parseInt(input[1]);
			break;
			default:
				return input;
		}
		var result = [];
		for (var i = lowBound; i <= highBound; i++)
		result.push(i);
		return result;
	};
})

.filter('uiBirthdayPickerCapitalize', function() {
	return function(input, scope) {
		if (input!=null)
			input = input.toLowerCase();
		return input.substring(0,1).toUpperCase()+input.substring(1);
	}
})


.filter('uiBirthdayPickerTr', function() {
	return function(input, locale) {
		var locales={
			'ru':{'year':'год', 'month':'месяц', 'day':'день'},

		};
		var localeData;
		var keys=Object.keys(locales);

		if (keys.indexOf(locale)==-1){
			return input;
		}
		localeData=locales[locale];
		keys=Object.keys(localeData);
		if (keys.indexOf(input)==-1){
			return input;
		}
		return localeData[input];
	};
})

.directive('birthdayPicker', function( ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			locale: '=?',
			minAge:'=?',
			maxAge:'=?',
			birthday: '=?',
			birthdayIso: '=?',
			ngDisabled:'=?',
			btnClass: '@?'
		},
		controller: function($scope) {
			if (!$scope.birthday){
				$scope.birthday={year:'y', month:'m', day:'d'};
			}
			if ($scope.birthdayIso){
				var date=moment($scope.birthdayIso);
				$scope.birthday={
					year: date.year(),
					month: date.month(),
					day: date.date()
				};
			}

			if (!$scope.locale){
				$scope.locale="en";
			}
			if ($scope.maxAge){
				$scope.minYear=moment().year()-$scope.maxAge;
			}
			if ($scope.minAge){
				$scope.maxYear=moment().year()-$scope.minAge;
			}
			if (!$scope.btnClass){
				$scope.btnClass = 'btn-default';
			}



			$scope.ml = moment().locale($scope.locale);

			function getDaysInMonth(year, month){
				return moment([year,month]).daysInMonth();
			}
			function checkPickedDay(year, month, day){
				var days=$scope.daysInMonth;
				if (day>days){
					day=days;
				}
				return day;
			}

			$scope.localeMonth = function(month){
				return $scope.ml.localeData().months(
												moment([0,month])
				);
			}

			$scope.getMaxMonth = function(){
				//
				if (!$scope.minAge){ return 11 };
				if ($scope.birthday.year==$scope.maxYear){
					return moment().month();
				}
				return 11;
			}
			$scope.getMaxDay = function(year,month){
				if (!Number(year) || !Number(month)){ return 31; }
				var daysInMonth=getDaysInMonth(year,
												 month);

				if (!$scope.minAge){ return daysInMonth };
				if ($scope.birthday.year==$scope.maxYear && month==moment().month()){
					return moment().date();
				}
				return daysInMonth;
			}

			$scope.$watch('birthday.month', function(month) {
				$scope.daysInMonth=$scope.getMaxDay($scope.birthday.year,
													month);
				$scope.birthday.day=checkPickedDay($scope.birthday.year,
												  month,
												  $scope.birthday.day);
			});
			$scope.$watch('birthday.year', function(year) {
				$scope.daysInMonth=$scope.getMaxDay(year, 
												   $scope.birthday.month);
				var maxMonth=$scope.getMaxMonth();
				if ($scope.birthday.month>maxMonth){
					$scope.birthday.month=maxMonth;
				}
				$scope.birthday.day=checkPickedDay(year,
												  $scope.birthday.month,
												  $scope.birthday.day);

			});

			$scope.$watch('birthday', function(birthday) {
				var birthdayIso=moment([
					birthday.year,
					birthday.month,
					birthday.day
				]).toISOString();
				if (birthdayIso.indexOf("Invalid")>-1){
					birthdayIso=null;
				}
				$scope.birthdayIso = birthdayIso;
				
			}, true);

		},
		templateUrl: '/static/widgets_app/birthdayPicker/birthdayPicker.html'
	};
})


