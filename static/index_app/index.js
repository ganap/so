

var app = angular.module("App", [ 
										'ngMaterial',
										'ngMessages',
										'MaterialHelper',
										 'Base',
										 'uiSmallWidgets',
										 'uiD3Charts',
										 'SO_Im',
										 'SO_UserProfile',
										 'SO_FirstRun',
										 'SO_RelatedPersons',
										 'Cornerstone',
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



.controller("navbarMenuCtrl", ["$scope", "djRest","userProfile","$location", 
						function($scope, djRest, userProfile, $location) {
	$scope.userProfile = userProfile;

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

.controller("urlCtrl", ["$scope","$location", "userProfile",  
						function($scope, $location, userProfile) {
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

.controller("defaultCtrl", ["$scope","$location", "userProfile", "dialogsAndVideoIm", 
						function($scope, $location, userProfile, dialogsAndVideoIm) {
	$scope.userProfile = userProfile;
	$scope.dialogsAndVideoIm = dialogsAndVideoIm;
	userProfile.loadUserProfile();

}])


.controller('AppCtrl', ['$scope', '$mdSidenav',"materialHelper", "userProfile", "$location", "$route",
			function($scope, $mdSidenav, materialHelper, userProfile, $location, $route){
	$scope.userProfile = userProfile;
	$scope.location = $location ;
	$scope.materialHelper = materialHelper;
	$scope.closeSideNav = materialHelper.closeSideNav ;
	$scope.toggleLeft = materialHelper.buildToggler('left') ;
	//
	//
	//
	function getTitle(path){
		var TITLES={
			'/patient/measurements':'Dashboard',
			'/patient/profile': 'Profile',
			'/patient/related-persons': 'Care Team',
			'/patient/related-persons/create': 'Add Care Team Member',
			'/patient/emr': 'Health Data'
		}
		var TITLES_={
			'/patient/related-persons/edit': 'Care Team Member'
		}
		function getTitle_(path){
			for (var obj in TITLES_) {
				console.log(obj);
				if (path.indexOf(obj)>-1){
					return TITLES_[obj];
				}
			};
			return;
		}
		if (TITLES.hasOwnProperty(path)){
			return TITLES[path];
		}
		else{
			var title=getTitle_(path);
			if (title){ 
				return title ;
			}
			return  'Second Opinion' ;
		}
	}
	$scope.getTitle = function(){
		var path=$location.path();
		var title=getTitle(path);
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
		return title;
	}	
	$scope.getSubTitle = function(){
		
	}
}])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('pink');
})

.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/', {
						 templateUrl: _TRGEN_HTML('/static/index_app/default.html'),
						 controller: 'defaultCtrl'
					 })

					 ;
				 }])
;
