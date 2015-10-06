angular.module('SO_Im')


.directive('imDialogMsgEditor', ["dialogsAndVideoIm", function(dialogsAndVideoIm) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			withUserPk:'=',
			ngDisabled: '=?'
		},
		link: function($scope, element){

			$scope.dialogsAndVideoIm = dialogsAndVideoIm;
			element.find('textarea').bind("keydown keypress", function(event) {
				if(event.which === 13) {
					event.preventDefault();

					var text=angular.element(this).val();
					$scope.dialogsAndVideoIm.ws.sendSignal.sendMessage($scope.withUserPk,
																	  text);
					angular.element(this).val('');
					console.log(text);
				}
			});

		},
		templateUrl: '/static/im_app/dialogs/imDialogMsgEditor.html'
	};
}])



.directive('imDialogMsgList', ["dialogsAndVideoIm", 'userProfile',"$filter",
			function(dialogsAndVideoIm, userProfile, $filter) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			withUserPk:'=',
			ngDisabled: '=?'
		},
		controller: function($scope) {
			var orderBy = $filter('orderBy');

			$scope.dialogsAndVideoIm = dialogsAndVideoIm;
			$scope.userProfile = userProfile ;
			function loadDialogMsgList(withUserPk){
				if (!withUserPk) return;
				try{
					$scope.dialogsAndVideoIm.ws.sendSignal.getDialogMsgList(withUserPk);
					$scope.dialogsAndVideoIm.ws.sendSignal.markDialogAsReaded(withUserPk);
				}
				catch(e){
					setTimeout(
						loadDialogMsgList(withUserPk),
						1000
					);
				}
			}
			$scope.$watch('withUserPk', function(withUserPk) {
				loadDialogMsgList(withUserPk);
			});
			loadDialogMsgList($scope.withUserPk);
		},
		templateUrl: '/static/im_app/dialogs/imDialogMsgList.html'
	};
}])


.directive('imDialogUserList', ["dialogsAndVideoIm", function(dialogsAndVideoIm) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			onUserDialogClick: '&',
		},
		controller: function($scope) {
			$scope.dialogsAndVideoIm = dialogsAndVideoIm;

			$scope.userDialogClick = function(dialog){
				$scope.dialogsAndVideoIm.currentDialog = dialog;
				$scope.onUserDialogClick(dialog);
			}

		},
		templateUrl: '/static/im_app/dialogs/imDialogUserList.html'
	};
}])

;
