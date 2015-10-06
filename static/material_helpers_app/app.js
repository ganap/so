angular.module('MaterialHelper', ['ngMaterial'])

.service("materialHelper", ["$timeout", "$mdSidenav", "$mdUtil",  
						function($timeout, $mdSidenav, $mdUtil) {

	this.buildToggler = function(navID) {
		console.log(navID);
		var debounceFn =  $mdUtil.debounce(function(){
			$mdSidenav(navID)
			.toggle()
		},200);
		return debounceFn;
	}

	this.closeSideNav = function(navID){
		console.log(navID);
		$mdSidenav(navID).close();
	}

}])



;
