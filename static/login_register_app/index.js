
var app = angular.module("App", [ 
										 'Base',
										 'ngMaterial',
										 'MaterialHelper',
										 'ngRoute',
										 'uiRegistration',
										 'uiSmallWidgets',
										 'ngResource'
								   ]
)
//
//		Configuration
//
.config(['$httpProvider', function ($httpProvider) {
	// csrf token for django auth
	//
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
	$httpProvider.defaults.headers.post['X-CSRFToken']=Cookies.get("csrftoken");
	// for cookies in tornado
	//$httpProvider.defaults.withCredentials = true;
}])


.controller("loginCtrl", ["$scope","$location", "$routeParams", "djRest", 
						function($scope, $location, $routeParams, djRest) {
			$scope.user={
				username:'',
				password:''
			};
			$scope.login = function(){
				djRest.Registration.login(null, $scope.user,
										  function(data){
											  location.replace('/s/');
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
}])

.controller("registrationCtrl", ["$scope", "djRest","const", 
						function($scope, djRest,c) {


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

										   $scope.error="Can't register profile with email "+
												   $scope.user.email+". Is email exists?";
										   $scope.showRegisterFail=true;
									   });
	}

	$scope.restartRegistration = function(){
		//$scope.user={};
		$scope.disableForm = false;
		$scope.showRegisterComplete=false;
		$scope.showRegisterFail=false;
	}


	
}])


.controller('AppCtrl', ['$scope', '$mdSidenav',"materialHelper", function($scope, $mdSidenav, materialHelper){
	$scope.materialHelper = materialHelper;
	$scope.closeSideNav = materialHelper.closeSideNav ;
	$scope.toggleLeft = materialHelper.buildToggler('left') ;
}])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('purple');
})


;
