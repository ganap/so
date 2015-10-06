//
//
//
angular.module('uiCompositeWidgets')

.directive("cwUploadDropdown", ["djRest",  
						function( djRest) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			userPk:'=?',
			onUploadComplete: '&?',
			onUploadFail: '&?',
		},
		controller: function($scope) {
			var ALLOWED_EXT=['jpg', 'png', 'jpeg', 'tiff', 'txt', 'pdf', 'dicom', 'dcm']
			$scope.xhr=null;

			function isFileAllowed(file){
				var ext=file.name.split(".");
				ext=ext[ext.length-1].toLowerCase();
				return ALLOWED_EXT.indexOf(ext)>-1;
			}


			function uploadFile(file){
				$scope.uploading = true;
				$scope.progress = 0;
				var user_pk=$scope.userPk;
				if (!user_pk) user_pk=0;

				$scope.xhr=djRest.Attachments.upload({'file': file, 'date': file.lastModifiedDate, 'user_pk':user_pk},
										  function(data){
											  console.log(data);
											  $scope.$apply(function(){
												  $scope.uploading = false;
												  $scope.xhr = null;
												  if (!$scope.onUploadComplete){return;}
												  $scope.data = data ;
												  $scope.onUploadComplete({data:$scope.data});
											  });
										  },
										  function(data){
											  $scope.$apply(function(){
												  $scope.uploading = false;
												  $scope.xhr =null;
												  $scope.error = "Can't upload file=(";
												  if (!$scope.onUploadFail){return;}
												  $scope.onUploadFail(data);
											  });
										  },
										  function(progress){
											  console.log(progress);
											  $scope.$apply(function(){
												  $scope.progress = progress ;
											  });
										  });
			}

			$scope.onReset = function(){
				if ($scope.xhr){
					$scope.xhr.abort();
				}
				$scope.error = '';
				$scope.upload = false;
			}

			$scope.$watch('doc', function(doc) {
				if (doc==undefined || doc==null){ return; }
				if (isFileAllowed(doc)){
					uploadFile(doc);
					$scope.doc = null;
				}
				else{
					$scope.error = "Wrong file type!";
				}
			});

		},
		templateUrl: '/static/composite_widgets_app/attachment/uploadDropdown.html'
	};	
}])



.directive("cwAttachmentThumb", ["djRest",  
						function( djRest) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			attachment: '=',
		},
		controller: function($scope) {
		},
		templateUrl: '/static/composite_widgets_app/attachment/attachmentThumb.html'
	};	
}])


.directive("cwAttachmentView", ["djRest",  
						function( djRest) {
	//
	//
	//
	return {
		restrict: 'E',
		scope: {
			attachment: '=',
		},
		controller: function($scope) {
			$scope.getPdfUrl = function(){
				var viewer="http://docs.google.com/viewer?url=";
				var gcloud="https://storage.googleapis.com/";
				gcloud=gcloud+$scope.attachment.gcloud_path.bucket+"/"+$scope.attachment.gcloud_path.path;
				return viewer+gcloud+"&embedded=true";
			}
		},
		templateUrl: '/static/composite_widgets_app/attachment/attachmentView.html'
	};	
}])


				 
;
