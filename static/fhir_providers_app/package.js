
var app = angular.module("uiFhirProviders", [ 
										 'uiSmallWidgets',
										 'uiBirthdayPicker',
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
	$httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
	// for cookies in tornado
	//$httpProvider.defaults.withCredentials = true;
}])



;
