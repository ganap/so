//
//
//
//		MODULE:::
//
//
//
angular.module('SO_Im')


.controller("sidenavDialogCtrl", ["$scope","$location", "$routeParams", "djRest",'$mdUtil', '$mdSidenav', "dialogsAndVideoIm", 
						function($scope, $location, $routeParams, djRest, $mdUtil, $mdSidenav, dialogsAndVideoIm) {
	
	/**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle();
          },200);
      return debounceFn;
    }
	$scope.toggleDialogList = buildToggler('right-dialog-list');
	$scope.dialogsAndVideoIm = dialogsAndVideoIm;
	$scope.closeDialogList = function () {
		$mdSidenav('right-dialog-list').close();
    };

	$scope.onUserDialogClick = function(dialog){
		$scope.closeDialogList();
		$mdSidenav('right-dialog-msg-list').toggle();
	};
}])


.controller("sidenavDialogMsgCtrl", ["$scope","$location", "dialogsAndVideoIm", "djRest",'$mdUtil', '$mdSidenav', 
						function($scope, $location, dialogsAndVideoIm, djRest, $mdUtil, $mdSidenav) {
	
	/**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle();
          },200);
      return debounceFn;
    }

	$scope.dialogsAndVideoIm = dialogsAndVideoIm;
	$scope.closeDialogMsg = function () {
		$mdSidenav('right-dialog-msg-list').close();
    };
	$scope.showDialogList = function () {
		$mdSidenav('right-dialog-msg-list').close();
		$mdSidenav('right-dialog-list').toggle();
    };


	$scope.callToUser = function(userPk){
		$scope.dialogsAndVideoIm.ws.sendSignal.call(userPk);	
	}


}])			 
;
