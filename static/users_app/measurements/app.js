//
//
//
//
//
//
angular.module('SO_UserProfile')


.directive('mSmile', [ function( ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			name:'@',
			type: '@',
			picked: '=?'
		},
		controller: function($scope) {
			function changeFClass(name){
				if(name.indexOf('face')>-1){
					var f=name.replace('face-','');
					if (f=='good'){
						$scope.fclass = 'fa fa-smile-o fa-3x' ;
					}
					if (f=='normal'){
						$scope.fclass = 'fa fa-meh-o fa-3x' ;
					}
					if (f=='bad'){
						$scope.fclass = 'fa fa-frown-o fa-3x' ;
					}
					$scope.text = '';
				} 
				if (name.indexOf('number')>-1){
					$scope.fclass='smile-circle'
					$scope.text=name.replace('number-','');
				}
			}
			function changeFType(type){
				$scope.ftype = 'smile-'+type;
			}
			function changeFAdditional(picked){
				if (picked){
					$scope.faddtiotional='active';
				}
				else{
					$scope.faddtiotional = '' ;
				}
			}
			$scope.$watch('name', function(name) {
				changeFClass(name);
			});
			$scope.$watch('type', function(type) {
				changeFType(type);
			});
			$scope.$watch('picked', function(picked) {
				changeFAdditional(picked);
			});


			changeFClass($scope.name);
			changeFType($scope.type);
			changeFAdditional($scope.picked);
		},
		template: '<i class="{{fclass}} {{faddtiotional}} {{ftype}}"><div>{{text}}</div></i>'
	};
}])


.directive('mSmileLine', [ function( ) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel: '=',
			type: '@',
		},
		controller: function($scope) {
			if ($scope.type=='face'){
				$scope.smileList={
					0:{'name': 'face-good', 'type': 'good'},
					1:{'name': 'face-normal', 'type': 'middle'},
					2:{'name': 'face-bad', 'type': 'bad'},
				}
			}
			else{
				$scope.smileList = {
					0:{'name': 'number-0', 'type': 'good'},
					1:{'name': 'number-1', 'type': 'middle-1'},
					2:{'name': 'number-2', 'type': 'middle-2'},
					3:{'name': 'number-3', 'type': 'bad'},
				} ;
			}


			$scope.setSmile = function(index){
				$scope.ngModel = index;
			}

		},
		templateUrl:"/static/users_app/measurements/smileLine.html",
	};
}])




.controller("measurementsCtrl", ["$scope","$location", "userProfile", "djRest", 
						function($scope, $location, userProfile, djRest) {
	//
	$scope.userProfile = userProfile;
	$scope.userProfile.setSubTitle('Daily checkin');
	$scope.loading = true;

	function timeLeftToNextMeasure(measurements){
		var last_date=measurements.last_date;
		var now=moment();
		if (!last_date){
			return 0;
		}
		if (last_date.indexOf('Z')==-1){
			last_date=last_date+'Z';
		}
		var date=moment(last_date);
		date=date.add(23, 'hours');
		var diff=moment.duration(date.diff(now));
		var m=diff.minutes();
		var h=diff.hours();
		if (diff.minutes()<0 || diff.hours()<0){
			return 0;
		}
		if (diff.hours()<1){
			return diff.minutes()+" minutes";
		}
		return diff.hours()+" hours";
	}


	djRest.OwnProfile.measurements(function(data){
		if (!data.units){
			data.units='metric';
			$scope.init = true;
		}
		$scope.time_left_to_next_measure = timeLeftToNextMeasure(data);
		if ($scope.time_left_to_next_measure==0){
			$scope.daily = {i_took_today:{medication:'null', treatment: 'null'}};
		}
		else{
			$scope.daily = data.everyday_list[data.everyday_list.length-1];
		}
		$scope.measurements = data;
		$scope.loading = false;
	},
	function(data){
		$scope.error = "Can't fetch info" ;
		$scope.loading = false;
	});



	$scope.saveDailyMeasure= function(){
		if ($scope.time_left_to_next_measure){
			var djDayMeasure=djRest.OwnProfile.updateLastDayMeasure;
		}
		else{
			var djDayMeasure=djRest.OwnProfile.setDayMeasure;
		}
		djDayMeasure(angular.toJson($scope.daily),
					 function(data){
						 if(!$scope.time_left_to_next_measure){
							 delete $scope.measurements.everyday_list[$scope.measurements.everyday_list.length-1];
						 	 $scope.measurements.last_date = moment().toISOString();
							 $scope.time_left_to_next_measure = timeLeftToNextMeasure($scope.measurements) ;
						 }
						 $scope.measurements.everyday_list.push($scope.daily);
					 },
					 function(data){
						 $scope.error = "Can't update info" ;
					 });
	}



	$scope.create = function(){
		djRest.OwnProfile.createMeasurements($scope.measurements,
											 function(data){
												 $scope.userProfile.user.patient.measurements =data;
												 $scope.measurements = data;
												 $scope.init = false;
											 });
	}

	
}])


.controller("measurementsBasicCtrl", ["$scope","$location", "djRest",  
						function($scope, $location, djRest) {

	$scope.loading = true;
	djRest.OwnProfile.measurements(function(data){
		if (!data.units){
			data.units='metric';
			$scope.init = true;
		}
		$scope.measurements = data;
		$scope.loading = false;
	},
	function(data){
		$scope.error = "Can't fetch info" ;
		$scope.loading = false;
	});

	$scope.update = function(){
		var d=$scope.measurements;
		delete d.everyday_list;
		djRest.OwnProfile.updateMeasurements(d,
											 function(data){
											 },
											 function(data){
												 $scope.error = "Can't save information" ;
											 });
	}


}])

.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/patient/measurements', {
						 templateUrl: _TRGEN_HTML('/static/users_app/measurements/measurements.html'),
						 controller: 'measurementsCtrl'
					 })
					 .when('/patient/measurements/basic', {
						 templateUrl: _TRGEN_HTML('/static/users_app/measurements/measurementsBasic.html'),
						 controller: 'measurementsBasicCtrl'
					 })
					 ;
				 }])
				 
;
