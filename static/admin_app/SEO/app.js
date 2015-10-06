//
//
//
//		MODULE:::SEO
//
//
//
angular.module('SO_Admin')

.controller("seoCtrl", ["$scope","$location", "djRest",  
						function($scope, $location, djRest) {

	djRest.SitePreferences.get(function(data){
								$scope.site_pref = data ;
							},
							function(data){
								$scope.error=_TR("Can't get site preferences for SEO.");
							}) ;

	$scope.save = function(){
		$scope.disableForm = true ;
		djRest.SitePreferences.update($scope.site_pref,
									  function(data){
										  $scope.site_pref = data ;
										  location.reload();
									  },
									  function(data){
										  $scope.disableForm = false ;
										  $scope.error = _TR("Can't save site preferences for SEO") ;
									  })
	}
	
}])

.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/admin/seo', {
						 templateUrl: _TRGEN_HTML('/static/admin_app/SEO/seo.html'),
						 controller: 'seoCtrl'
					 })

					 ;
				 }])
				 
;
