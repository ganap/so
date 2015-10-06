angular.module('SO_SecondOpinion')


.directive('soPatientSummary', ["dialogsAndVideoIm", "userProfile","djRest", "sOpinion",
		   function(dialogsAndVideoIm, userProfile, djRest, sOpinion) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			so:'=',
			onViewClick:'&',
			onAssignClick:'&?',
			allowGetCase:'=?',
			allowRefuseCase: '=?',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			$scope.dialogsAndVideoIm = dialogsAndVideoIm ;
			$scope.userProfile = userProfile ;
			$scope.sOpinion = sOpinion;
			$scope.pick_expert = false ;

			function downloadPatient(user_pk){
				if (!user_pk) return;
				if (!sOpinion.isUserInCache(user_pk)){
					$scope.loading = true;
					djRest.Patients.get({pk:user_pk},
										function(data){
											$scope.error = '' ;
											$scope.sOpinion.USERS[data.pk]=data;
											$scope.patient = $scope.sOpinion.USERS[user_pk] ;
											$scope.loading = false;
										}, function(data){
											$scope.error = "Can't download patient info" ;
										});
					return;
				}
				$scope.patient = $scope.sOpinion.USERS[user_pk] ;
			}
			function downloadExpert(user_pk){
				if (!user_pk && user_pk!=0) return;
				if (!sOpinion.isUserInCache(user_pk)){
					$scope.loading = true;
					djRest.Experts.get({pk:user_pk},
										function(data){
											$scope.error = '' ;
											$scope.sOpinion.USERS[data.pk]=data;
											$scope.expert = $scope.sOpinion.USERS[user_pk] ;
											$scope.loading = false;
										}, function(data){
											$scope.error = "Can't download expert info" ;
										});
					return;
				}
				$scope.expert = $scope.sOpinion.USERS[user_pk] ;
			}

			$scope.$watch('so', function(so) {
				downloadPatient(so['user']);
				if (so['assigned_to']==0) return;
				downloadExpert(so['assigned_to']);

			}, true);

			$scope.onView = function(patient){
				$scope.onViewClick({patient: patient});
			}

			$scope.onAssign = function(patient){
				$scope.onAssignClick({patient: patient, so:$scope.so});
			}
			//	только для експерта
			//
			$scope.onGetCase = function(patient){
				$scope.sOpinion.ws.sendSignal.moveSo($scope.so, 'opened', 'in_progress');
			}
			$scope.onRefuseCase = function(patient){
				$scope.sOpinion.ws.sendSignal.refuseFrom($scope.so);
			}

			downloadPatient($scope.so['user']);
			if ($scope.so['assigned_to']>0){
				downloadExpert($scope.so['assigned_to']);
			}
			
		},
		templateUrl: '/static/so_app/shared/soPatientSummary.html'
	};
}])


.directive('soDashboard', ["sOpinion", "djRest", "dialogsAndVideoIm", "userProfile",
		   function(sOpinion, djRest, dialogsAndVideoIm, userProfile) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			userType:"=?"
		},
		controller: function($scope) {
			$scope.sOpinion = sOpinion ;
			$scope.dialogsAndVideoIm = dialogsAndVideoIm;
			$scope.userProfile = userProfile ;

			$scope.onViewClick = function(patient){
				$scope.currentPatient = patient;
			}
			$scope.assignTo = function(patient, so){
				$scope.pick_expert = true;
				$scope.patient = patient;
				$scope.so = so;
				djRest.Experts.query(function(data){
					$scope.expert_list = data ;
				});
			}		
			$scope.assignPatientTo = function(expert){
				var patient=$scope.patient;
				var so=$scope.so;
				$scope.sOpinion.ws.sendSignal.assignTo(so, expert.pk);
				$scope.pick_expert = false;

			}

			$scope.goBack = function(){
				$scope.pick_expert = false;
			}

			//	отфильтровывание только собственных дел для эксперта и
			//	отображение всех дел для админа и координатора
			//
			function collectSO(list){
				if (!list) return [];
				var new_list=[];
				for (var i = 0; i < list.length; i++) {
					if(list[i].assigned_to==userProfile.user.pk){
						new_list.push(list[i])
					}
				};
				return new_list;
			}
			$scope.$watch('sOpinion.queue', function(queue) {
				$scope.queue_count={
					opened:'',
					closed:'',
					in_progress:'',
					processed_:'',
				};

				if (userProfile.user.is_expert){
					$scope.queue = {
						opened: collectSO(queue.opened),
						in_progress: collectSO(queue.in_progress),
						closed: collectSO(queue.closed),
						processed_: collectSO(queue.processed_)
					} ;					
				}
				else{
					$scope.queue = queue;
				}
				if ($scope.queue.opened.length){
					$scope.queue_count.opened = " (+"+$scope.queue.opened.length+")" ;
				}
				if ($scope.queue.in_progress.length){
					$scope.queue_count.in_progress = " ("+$scope.queue.in_progress.length+")" ;
				}
				if ($scope.queue.closed.length){
					$scope.queue_count.closed = " ("+$scope.queue.closed.length+")" ;
				}
				if ($scope.queue.processed_.length){
					$scope.queue_count.processed_ = " ("+$scope.queue.processed_.length+")" ;
				}


			}, true);

		},
		templateUrl: '/static/so_app/shared/soDashboard.html'
	};
}])



.directive('soDiagnosis', ["userProfile", "sOpinion", "$location", "$route","djRest",
		   function(userProfile, sOpinion, $location, $route, djRest) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			userPk:'=',
			viewMode:'=?',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			var so_pk=$route.current.params.so;
			$scope.sOpinion = sOpinion ;
			$scope.so = {};
			$scope.diagnosis = {};

			djRest.SOpinion.get({pk:so_pk},
								function(data){
									$scope.error = '' ;
									$scope.diagnosis = data;
								},
								function(){
									$scope.error = "Can't download info for second opinion." ;
								});

			$scope.publishSO = function(){
				djRest.SOpinion.update({pk: so_pk},$scope.diagnosis,
									   function(data){
										   $scope.error = '' ;
										   $scope.diagnosis = data ;
										   // закрываем so на стороне tornado 
										   $scope.sOpinion.ws.sendSignal.moveSo({so_pk:so_pk},
																			   'in_progress',
																			   'processed_');
											// и переходим в дэшборд
											$location.path("/dashboard");
									   },
									   function(data){
											$scope.error = "Can't publish second opinion=(" ;
									   });
			}
			$scope.requestAdditionalInfo = function(){
				
			}
			
		},
		templateUrl: '/static/so_app/shared/soDiagnosis.html'
	};
}])





.directive('soDiagnosisFullView', ["djRest", "userProfile", function(djRest, userProfile) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			diagnosis:'=',
		},
		controller: function($scope) {
			$scope.userProfile = userProfile ;
			$scope.$watch('diagnosis.from_expert', function(from_expert) {
				djRest.Experts.get({pk:from_expert},
								   function(data){
									   $scope.expert = data;
								   })
			});

		},
		templateUrl: '/static/so_app/shared/soDiagnosisFullView.html'
	};
}])






.directive('soPaypalButton', ["djRest", "userProfile",  function(djRest, userProfile ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			ngModel:'=?',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			function composeHtmlButton(prButton){
				if (!prButton.hasOwnProperty('prices')){ return ''; }
				var invoice=userProfile.user.pk+"="+Date.now();
				var price=prButton.prices['single'];
				return prButton.button_html.replace("#PRICE#", price).replace("#INVOICE#", invoice);
			}

			djRest.Paypal.button(function(data){
				$scope.paypalButton=data;
				$scope.paypalButton.button=composeHtmlButton($scope.paypalButton);
			});				
		},
		template: '<div ng-bind-html="paypalButton.button | htmlUnsafe"></div>'
	};
}])

