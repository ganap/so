angular.module('SO_Coordinator', ['ngRoute']);

var app = angular.module("App", [ 
										'ngMaterial',
										'ngMessages',
										'SO_UserProfile',
										'yaru22.jsonHuman',
										'MaterialHelper',
										'uiRegistration',
										'SO_Coordinator',
										'SO_Im',
										'SO_SecondOpinion',
										 'Cornerstone',
										'uiFhirProviders',
										'uiFhirDocs',
										 'Base',
										 'uiSmallWidgets',
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

.controller('AppCtrl', ['$scope', '$mdSidenav',"materialHelper", "$location","$route",
			function($scope, $mdSidenav, materialHelper, $location, $route){
	$scope.materialHelper = materialHelper;
	$scope.closeSideNav = materialHelper.closeSideNav ;
	$scope.toggleLeft = materialHelper.buildToggler('left') ;
	//
	//
	function setSubTitle(path){
		if (!path){return '';}
		var TITLES={
			'/dashboard':'Dashboard: Cases',
			'/coordinator/patients/create': 'Patient Profile',
			'/coordinator/patients/create/fhir': 'Patient’s Health Record',
			'/coordinator/patients/create/fhir/import': 'Patient Profile',
			'/patient/emr': 'Health Data'
		}
		var TITLES_={
			'/patient/related-persons/edit': 'Care Team Member'
		}
		function getTitle_(path){
			if (!path) return '';
			for (var obj in TITLES_) {
				if (path.indexOf(obj)>-1){
					return TITLES_[obj];
				}
			};
			return;
		}
		if (TITLES.hasOwnProperty(path)){
			$scope.subTitle = TITLES[path];
			return TITLES[path];
		}
		else{
			var title=getTitle_(path);
			if (title){ 
				$scope.subTitle = title ;
				return title;
			}
			$scope.subTitle = 'Second Opinion' ;
			return $scope.subTitle;
		}
	}

	$scope.getTitle = function(){
		var path=$location.path();
		var title=setSubTitle(path);
		if (path.indexOf('/coordinator/patients/create/fhir/import')>-1){
			title=title+": "+$route.current.params['n'];
			return title;
		}
		if (path.indexOf('/coordinator/patients/edit/')>-1){
			title=$route.current.params['n'];
			return title;
		}
		if ($route.current.params.hasOwnProperty('n')){
			$location.search('n', null);
		}
		return setSubTitle($location.path());
	}
}])


.controller('defaultCtrl', ['$scope', '$mdSidenav',"materialHelper", function($scope, $mdSidenav, materialHelper){
	$scope.materialHelper = materialHelper;
	$scope.closeSideNav = materialHelper.closeSideNav ;
	$scope.toggleLeft = materialHelper.buildToggler('left') ;
}])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('teal')
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
