//
//
//
//
angular.module('uiCompositeWidgets')

.directive("cwEmrManagement", [ "djRest",  
						function( djRest) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			userPk:'=?',
			kioskMode:'=?',
			hideDeleteBtn: '=?',
		},
		controller: function($scope) {
			$scope.attachments = [] ;
			function loadByOwner(userPk){
				djRest.Attachments.query({additional: 'by-owner',
									   pk:userPk},
									   function(data){
										   $scope.attachments = data ;
									   });
			}
			console.log($scope.userPk);
			console.log("+++++++++++++++++++++");
			if (!$scope.userPk){
				djRest.Attachments.query(function(data){
					$scope.attachments = data ;
				});
				$scope.$watch('userPk', function(userPk) {
					if (!userPk) return;
					loadByOwner(userPk);
				});
			}
			else{
				loadByOwner($scope.userPk);
			}

			$scope.onUploadComplete = function(data){
				$scope.attachments.push(data);
			}
			$scope.setCurrentAttachment = function(a){
				$scope.currentAttachment = a ;
			}
			$scope.unsetCurrentAttachment = function(){
				$scope.currentAttachment = null;
				$scope.fullscreen = false ;
				$("md-tab-content").css('display','block');
				$(".contentWrapper").removeClass("fullscreen");
			}

			$scope.deleteAttachment = function(a){
				djRest.Attachments.delete({pk: a.pk},
										  function(data){
											  var index=$scope.attachments.indexOf(a);
											  if (index>-1){
												  $scope.attachments.splice(index,1);
												  $scope.currentAttachment = null;
											  }
										  });

			}

			$scope.goFullscreen = function(){
				$scope.fullscreen = true;
				$("md-tab-content").css('display','inline');
				$(".contentWrapper").addClass("fullscreen");
			}
		},
		templateUrl: '/static/composite_widgets_app/emr/emr.html'
	}

}])
				 
;
