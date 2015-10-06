angular.module('SO_SecondOpinion')


.service("sOpinion", ['$ws', '$rootScope', '$mdDialog', '$location', '$mdSidenav',
			function($ws, $rootScope, $mdDialog, $location, $mdSidenav) {
	var self=this;
	this.ws=$ws();
	this.queue={};
	this.USERS={};

	this.isUserInCache = function(user_pk){
		var keys=Object.keys(self.USERS);
		return keys.indexOf(user_pk)>-1;
	}


	if (location.hostname=='localhost'){
		this.ws.connect('localhost:8888', '/websocket/so/');
	}
	else{
		this.ws.connect('104.155.31.77', '/websocket/so/');
	}
	//
	//
	//
	function getSoIndex(queue, so){
		var index=-1;
		for (var i = 0; i < queue.length; i++) {
			if (queue[i].user==so.user && queue[i].date==so.date){
				index=i;
			}
		};
		return index;
	}
	//
	//
	//

	this.ws.createSignal('openSo',
						 function(soPk){
							self.ws.sendMessage('open_so',{so_pk:soPk});			 
						 });
	this.ws.createSignal('assignTo',
						 function(so, to_user_pk){
							self.ws.sendMessage('assign_to',
												{
													so:so,
													to_user_pk:to_user_pk
												});			 
						 });
	this.ws.createSignal('moveSo',
						 function(so, from_, to_){
							self.ws.sendMessage('move_so',
												{
													so:so,
													from:from_,
													to:to_
												});			 
						 });
	this.ws.createSignal('cancelRequest',
						 function(user_pk){
							self.ws.sendMessage('cancel_so',
												{
													user_pk:user_pk
												});			 
						 });
	this.ws.createSignal('refuseFrom',
						 function(so){
							self.ws.sendMessage('refuse',
												{
													so:so
												});			 
						 });
	
	//
	//

	this.ws.subscribeCallback('all_queue', 
							  function(data){
								  self.queue=data;
								  console.log(data);
								  $rootScope.$$phase || $rootScope.$apply();
							  });

	this.ws.subscribeCallback('move_so', 
							  function(data){
								  var from_=data.from;
								  var to_=data.to;
								  var so=data.so;
								  console.log('move so');
								  console.log(data);

								  if (!from_){
									  //новый
									  self.queue.opened.push(so);
									  $rootScope.$$phase || $rootScope.$apply();
									  return;
								  }
								  if (!to_){
									  //удаление 
									  var index=getSoIndex(self.queue[from_], so);
									  self.queue[from_].splice(index,1);
									  $rootScope.$$phase || $rootScope.$apply();
									  return;
								  }

								  var index=getSoIndex(self.queue[from_], so);
								  if (index>-1){
									  self.queue[from_].splice(index,1);
								  }
								  self.queue[to_].push(so);
								  $rootScope.$$phase || $rootScope.$apply();
							  });
	
}])

;
