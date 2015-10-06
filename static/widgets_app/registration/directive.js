//
//
//		MODULE:::Login/Registration
//
//
//
angular.module("uiRegistration", ['ngMessages', 'ngMaterial'])


//
//
//		Directives for input validation
//
//

.directive('usernameAvailable', ["$q", "djRest", function($q, djRest) {
	return {
		restrict: 'AE',
		require: 'ngModel',
		link: function(scope, elm, attr, model) { 
			model.$validators.usernameExists = function() { 
				model.$setValidity('usernameExists', true);

				djRest.Registration.isUsernameExists({username: model.$$rawModelValue},
													 function(data){
														 if (data.username){
															 model.$setValidity('usernameExists', false);
															 return false;
														 }
													 });

				return true;
			};
		}
	} 
}])

.directive('emailAvailable', ["$q", "djRest", function($q, djRest) {
	return {
		restrict: 'AE',
		require: 'ngModel',
		link: function(scope, elm, attr, model) { 
			model.$validators.usernameExists = function() { 
				model.$setValidity('emailExists', true);

				djRest.Registration.isEmailExists({email: model.$$rawModelValue},
													 function(data){
														 if (data.email){
															 model.$setValidity('emailExists', false);
															 return false;
														 }
													 });
				return true;
			};
		}
	} 
}])


//
//
//		Directive fot widgets
//
//
.directive('loginWidget', ["djRest", function(djRest) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			redirectUrl: '=',
			alignClass: '=?'
		},

		controller: function($scope) {

			$scope.user={
				username:'',
				password:''
			};
			$scope.login = function(){
				djRest.Registration.login(null, $scope.user,
										  function(data){
											  location.replace($scope.redirectUrl);
										  },
										  function(data){
											  console.log(data);
											  $scope.user.password = '' ;
											  if (!data.data.hasOwnProperty('error')){
												  $scope.error = "Can't login. Server is down." ;
											  }
											  else{
												  $scope.error = data.data.error;
											  }						  
										  });
			}
		},
		templateUrl: _TRGEN_HTML('/static/widgets_app/registration/loginWidget.html')
	}
}])


.directive('registerUserWidget', ["djRest", "const", function(djRest,c) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			d:'=?'
		},

		controller: function($scope) {
			console.log("hello");
			$scope.const = c ;
			$scope.user={};

			$scope.disableForm=false;
			$scope.showRegisterComplete=false;
			$scope.showRegisterFail=false;


			$scope.register = function(){
				$scope.disableForm=true;
				$scope.user.password=$scope.user.password1;

				djRest.Registration.createUser(null,
											  $scope.user,
											  function(data){
												  if (! data.hasOwnProperty('error')){
													  $scope.showRegisterComplete =true ;
												  }
												  else{
													  $scope.error=data['error'];
													  $scope.showRegisterFail=true;
												  }
											  },
											  function(data){
												  //fail
												  //
												  if (!data.data.hasOwnProperty('error')){

												  $scope.error=_TR("Can't register profile with email ")+
													  $scope.user.email+_TR(". Is email exists?");
												  }
												  else{
													  $scope.error = data.data.error;
												  }
												  $scope.showRegisterFail=true;
											  });
			}

			$scope.restartRegistration = function(){
				//$scope.user={};
				$scope.disableForm = false;
				$scope.showRegisterComplete=false;
				$scope.showRegisterFail=false;
			}
		},
		templateUrl: _TRGEN_HTML('/static/widgets_app/registration/registerUserWidget.html')
	}
}])


.directive('forgotPasswordLink', ["djRest", "$mdDialog", function( djRest, $mdDialog ) {
	//
	//
	//
	return {
		restrict: 'E',
		controller: function($scope) {

			function DialogController($scope, $mdDialog){
				$scope.email_sended = false ;
				$scope.email = '' ;
				$scope.sendEmail = function(){
					djRest.Registration.resetPassword(null,
													  {email: $scope.email},
													  function(){
														  $scope.email_sended = true;
													  });
				}
				$scope.cancel = function() {
					$mdDialog.cancel();
				};
			}
			$scope.showDialog = function(ev) {
				$mdDialog.show({
					controller: DialogController,
					templateUrl: '/static/widgets_app/registration/resetPasswordDialog.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true
				});
			};

		},
		template: '<button class="btn btn-block btn-default ripple-effect" ng-click="showDialog($event)">Forgot password?</button>'
	};
}])


;



