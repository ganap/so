angular.module('SO_UserProfile', ['ngRoute', 'SO_Im', 'SO_SecondOpinion'])



.service("userProfile", ["djRest", "$location", "$rootScope", 
						function(djRest, $location, $rootScope) {
	var self=this;
	this.user={};
	this.subTitle="";
	this.loading=true;
	this.updateProfileAvatar='';

	this.hasProfile = function(){
		if (!self.user.organization && !self.user.patient){
			return false;
		}
		return true;
	}
	this.setSubTitle = function(title){
		self.subTitle=": "+title;
	}

	this.loadUserProfile = function(){
		djRest.OwnProfile.get(null,
							  function(data){
									self.user=data;
									self.loading=false;
									$rootScope.$$phase || $rootScope.$apply();
									console.log(data);
									if (data.is_admin){
										Cookies.set('UserProfileType', 'Admin');
									}
									if (data.is_moderator){
										Cookies.set('UserProfileType', 'Coordinator');
									}
									if (data.is_expert){
										Cookies.set('UserProfileType', 'Expert');
									}
									if (!data.is_expert && !data.is_admin && !data.is_moderator){
										Cookies.set('UserProfileType', 'Patient');
									}
									if (!data.organization && !data.patient && !data.is_admin && !data.is_moderator && !data.is_expert){
										if ($location.path().indexOf('first-run')==-1){
											$location.path("/first-run");
										}
									}
							  },
							  function(data){
								  self.error="Can't fetch user profile. Try to reload page or logout.";
								  $rootScope.$$phase || $rootScope.$apply();
							  });
	}

	this.updatePatientProfile = function(){
		djRest.OwnProfile.updatePatientProfile(self.user,
											   function(data){
												   self.user.patient=data;
												   if (!self.photo){ return; }
												   djRest.OwnProfile.uploadPhoto({photo: self.photo},
														function(data){
															self.updateAvatar();
												   });
											   },
											   function(data){
												   $scope.error = "Can't save user profile=(" ;
											   });
	}

	this.updateAvatar = function(){
		this.updateProfileAvatar="?t="+new Date().getTime();
	}

	if (!this.user.pk){
		this.loadUserProfile();
	}
	
}])


;
