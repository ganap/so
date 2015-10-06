
var app = angular.module("SO_SecondOpinion", [ 
										 'ngMaterial',
										 'SO_Im',
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
;
