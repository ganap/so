angular.module('SO_Admin', ['ngRoute']);

var app = angular.module("App", [ 
										'ngMaterial',
										'ngMessages',
										'MaterialHelper',
										'uiRegistration',
										'SO_Admin',
										'SO_Im',
										 'Base',
										 'uiSmallWidgets',
										 'SO_UserProfile',
										 'SO_SecondOpinion',
										 'uiCompositeWidgets',
										 'ngRoute',
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



.controller("navbarMenuCtrl", ["$scope", "djRest","$location", 
						function($scope, djRest, $location) {

	$scope.logout = function(){
		djRest.Registration.logout(null,
								   function(data){
										location.replace("/");
								   });
	}
	$scope.fullUrl = function(){
		return $location.path();
	}	
}])

.controller("urlCtrl", ["$scope","$location", 
						function($scope, $location ) {
	$scope.url = function(){
		return $location.path().split("/")[1];
	}
	$scope.url2 = function(){
		var list = $location.path().split("/");
		try{
			return "/"+list[1]+"/"+list[2];
		}
		catch(e){
			return '';
		}
	}
	$scope.fullUrl = function(){
		return $location.path();
	}
}])

.controller('AppCtrl', ['$scope', '$mdSidenav',"materialHelper", function($scope, $mdSidenav, materialHelper){
	$scope.materialHelper = materialHelper;
	$scope.closeSideNav = materialHelper.closeSideNav ;
	$scope.toggleLeft = materialHelper.buildToggler('left') ;
}])


.controller('defaultCtrl', ['$scope', '$mdSidenav',"materialHelper", function($scope, $mdSidenav, materialHelper){
	$scope.materialHelper = materialHelper;
	$scope.closeSideNav = materialHelper.closeSideNav ;
	$scope.toggleLeft = materialHelper.buildToggler('left') ;
}])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-orange')
    .accentPalette('blue');
})

.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/', {
						 templateUrl: _TRGEN_HTML('/static/admin_app/default.html'),
						 controller: 'defaultCtrl'
					 })

					 ;
				 }])
;
