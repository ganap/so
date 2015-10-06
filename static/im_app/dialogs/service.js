angular.module('SO_Im')


.service("dialogsAndVideoIm", ['$ws', '$rootScope', '$mdDialog', '$location', '$mdSidenav',
			function($ws, $rootScope, $mdDialog, $location, $mdSidenav) {
	var self=this;
	this.dialogPref={};
	//
	//	dialogMsgListCache={<pk>: [{text:''}, {text:''}]}
	this.dialogMsgListCache={};
	this.currentDialog=null;
	self.ONLINE={};

	this.ws=$ws();
	if (location.hostname=='localhost'){
		this.ws.connect('localhost:8888', '/websocket/dialogs/');
	}
	else{
		this.ws.connect('104.155.31.77', '/websocket/dialogs/');
	}

	function pkIndexInDialogList(pk){
		var index=-1;
		for (var i = 0; i < self.dialogList.length; i++) {
			if(self.dialogList[i].dialog_with_user.pk==pk){
				index=i;
				break;
			}
		};
		return index;
	}
	//
	//		
	//		Chat
	//
	//
	//
	this.ws.createSignal('sendMessage',
						 function(with_user_pk, text){
							 self.ws.sendMessage('send_msg', {text: text, 
												 with_user_pk: with_user_pk,
												objs:{}});
						 });
	
	this.ws.createSignal('getDialogMsgList',
						 function(with_user_pk){
							 var users=Object.keys(self.dialogMsgListCache);
							 if (users.indexOf(with_user_pk)==-1){
								 self.ws.sendMessage('dialog_msg_list', {with_user_pk: with_user_pk});
							 }
						 });
	this.ws.createSignal('markDialogAsReaded',
						 function(with_user_pk){
							self.ws.sendMessage('mark_as_readed', {with_user_pk: with_user_pk}); 
						 });
	//
	this.ws.subscribeCallback('dialog_pref',
							  function(data){
								  //при получении этого сигнала нужно очистить весь
								  //кеш и закрыть все диалоги, т.к. этот сигнал говорит
								  //о разрыве или начале соединения с чат сервером.
								  self.dialogPref=data;
								  self.dialogMsgListCache={};
								  $rootScope.$$phase || $rootScope.$apply();
								  console.log('dialog_pref');
								  console.log(data);
							  });
	this.ws.subscribeCallback('dialog_list',
							  function(data){
								  console.log('dialog_list');
								  console.log(data);
								  self.dialogList=data;//{};
								  $rootScope.$$phase || $rootScope.$apply();
							  });
	this.ws.subscribeCallback('dialog_msg',
							  function(data){
								  //если сообщение принадлежит самому себе, то не выводится новых уведомлений
								  //если диалог отсутствует в кеше, то добавляем сообщение в кеш, но 
								  //помечаем его как диалог для обязательной загрузки с сервера всех сообщений
								  //
								  console.log(data);
								  var with_user_pk=data.dialog_with_user_pk;
								  var users=Object.keys(self.dialogMsgListCache);
								  if (self.currentDialog){
									  if (with_user_pk==self.currentDialog.dialog_with_user.pk){
										  //	проверяем не закрыто ли окно с сообщениями.
										  var sidenav=$(".md-sidenav-dialog-msg");
										  if (!sidenav.hasClass("md-closed")){
											  self.ws.sendSignal.markDialogAsReaded(with_user_pk);
										  }
									  }
								  }

								  if (users.indexOf(with_user_pk.toString())==-1){
									  self.dialogMsgListCache[with_user_pk]={
										  dialogs: [data.dialog_msg],
										  force_load:true
									  };
									  //	если человек впервые написал, то нужно добавить 
									  //	его в dialogList
									  //
									  //
									  var index=pkIndexInDialogList(with_user_pk);
									  if (index==-1){
										  self.dialogList.push({dialog_with_user: data.dialog_with_user});
										  index=self.dialogList.length-1;
									  }
									  self.dialogList[index]={
										  dialog_with_user: data.dialog_with_user,
										  unreaded_count: data.unreaded_count,
										  last_msg_timestamp: data.dialog_msg.timestamp
									  }
									  self.UNREADED_COUNT=self.countUnreaded();
									  $rootScope.$$phase || $rootScope.$apply();
									  return;
								  }
								  //
								  // если сообщение не является первым в кеше, то спокойно его добавляем 
								  // даже не смотря на наличие/отсутствие force_load в dialogMsgListCache
								  self.dialogMsgListCache[with_user_pk].dialogs.push(data.dialog_msg);
								  // обновляем сведения о последнем сообщении от человека
								  //
								  var index=pkIndexInDialogList(with_user_pk);
								  if (index==-1){
									  self.dialogList.push({dialog_with_user: data.dialog_with_user});
									  index=self.dialogList.length-1;
								  }
								  self.dialogList[index].last_msg_timestamp=data.dialog_msg.timestamp;
								  self.dialogList[index].unreaded_count=data.unreaded_count;
								  self.UNREADED_COUNT=self.countUnreaded();

								  $rootScope.$$phase || $rootScope.$apply();
							  });

	this.ws.subscribeCallback('dialog_msg_list',
							  function(data){
								  //	если в кеше присутствует force_load, то заменяем все содержимое кеша 
								  //	на это сообщение. иначе, добавляем сообщения в конец списка.
								  //
								  var with_user_pk=data.dialog_with_user_pk;
								  if (!self.dialogMsgListCache[with_user_pk]){
									  self.dialogMsgListCache[with_user_pk]={
										  dialogs:data.dialogs
									  };
									  $rootScope.$$phase || $rootScope.$apply();
									  return;
								  }

								  if (self.dialogMsgListCache[with_user_pk].force_load){
									  self.dialogMsgListCache[with_user_pk]={
										  dialogs:data.dialogs
									  };
									  $rootScope.$$phase || $rootScope.$apply();
									  return;
								  }
							  });
	this.ws.subscribeCallback('readed_dialog',
							  function(data){
								  var with_user_pk=data.dialog_with_user_pk;
								  var index=pkIndexInDialogList(with_user_pk);
								  if (index>-1){
									  self.dialogList[index].unreaded_count=0;
									  self.UNREADED_COUNT=self.countUnreaded();
									  $rootScope.$$phase || $rootScope.$apply();
								  }
							  });

	this.countUnreaded = function(){
		var unreaded=0;
		for (var i = 0; i < self.dialogList.length; i++) {
			unreaded+=self.dialogList[i].unreaded_count;
		};
		return unreaded;
	}

	//
	//
	//		Video Calls
	//
	//
	//
	this.ws.createSignal('call',
						 function(user_pk){
							self.ws.sendMessage('call', 
											   {'to_user_pk': user_pk});			 
						 });

	this.ws.createSignal('cancelCall',
						 function(user_pk){
							self.ws.sendMessage('cancel_call', 
											   {'to_user_pk': user_pk});			 
						 });



	this.ws.subscribeCallback('online',
							  function(data){
								  self.ONLINE=data.users;
								  console.log(data);
								  $rootScope.$$phase || $rootScope.$apply();
							  });
	
	this.ws.subscribeCallback('incoming_call', 
							  function(data){
								  console.log('INCOMING');
								  self.call=data;
								  $rootScope.$$phase || $rootScope.$apply();
								  var confirm = $mdDialog.confirm()
									.title('Incoming video call')
									.content('Would you like to chat with '+self.call.username+'?')
									.ok('Answer')
									.cancel('Cancel');
								  
								  $mdDialog.show(confirm).then(function() {
								      $mdDialog.cancel();
									  window.open("/video-call/room="+self.call.room+"/"
														+self.call.username+"/"+self.ws.CREDENTIALS.username+"/",
											  "_blank","toolbar=no, menubar=no, location=no, width=600, height=500");
								  }, function() {
									  $mdDialog.cancel();
									  self.ws.sendSignal.cancelCall(self.call.user);
								  });

							  });
	this.ws.subscribeCallback('call', 
							  function(data){
								  console.log('I call');
								  self.call=data;
								  $rootScope.$$phase || $rootScope.$apply();
								  window.open("/video-call/room="+self.call.room+"/"
														+self.ws.CREDENTIALS.username+"/"+self.call.username+"/",
											  "_blank","toolbar=no, menubar=no, location=no, width=600, height=500");
							  });
	this.ws.subscribeCallback('cancel_call', 
							  function(data){
								  console.log(data, self.call);
							  });

	//
	//	Css helpers
	//
	this.isUserPkOnline = function(userPk){
		if (!userPk) return false;
		var users=Object.keys(self.ONLINE);
		return users.indexOf(userPk.toString())>-1;
	}

	//	
	//	Additional functions
	//
	//
	this.startChatWith = function(userObj){
		var currentDialog={
			dialog_with_user:{
				pk:userObj.pk,
				username:userObj.username
			},
			unreaded_count:0
		};
		self.currentDialog=currentDialog;
		$rootScope.$$phase || $rootScope.$apply();
		$mdSidenav('right-dialog-list').close();
		$mdSidenav('right-dialog-msg-list').toggle();
	}
	
}])


.controller("onlineUsersCtrl", ["$scope","dialogsAndVideoIm", "djRest", "userProfile",  
						function($scope, dialogsAndVideoIm, djRest, userProfile) {
	$scope.dialogsAndVideoIm =  dialogsAndVideoIm;
	$scope.userProfile = userProfile;
	$scope.quantity = {"units":"mm[Hg]","code":"mm[Hg]","system":"http://unitsofmeasure.org","value":142} ;
	$scope.o = new Date() ;
	$scope.med ={
      "resourceType": "Medication",
      "id": "med",
      "name": "Nizatidine 15 MG/ML Oral Solution [Axid]",
      "code": {
        "coding": [
          {
            "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
            "code": "582620",
            "display": "Nizatidine 15 MG/ML Oral Solution [Axid]"
          }
        ]
      }
    } ;
	$scope.timing = 
		
		{
        "event": [
          {
            "start": "2008-04-05"
          }
        ],
        "repeat": {
          "frequency": 2,
          "duration": 1,
          "units": "d"
        }
      }
		
		;
	$scope.dosage =     {
      "text": "10 mL bid",
      "timingSchedule": {
        "event": [
          {
            "start": "2008-04-05"
          }
        ],
        "repeat": {
          "frequency": 2,
          "duration": 1,
          "units": "d"
        }
      },
      "doseQuantity": {
        "value": 10,
        "units": "mL",
        "system": "http://unitsofmeasure.org",
        "code": "mL"
      }
    } ;

	$scope.prescr = 
		
{
  "resourceType": "MedicationPrescription",
  "text": {
    "status": "generated",
    "div": "<div>\n      Nizatidine 15 MG/ML Oral Solution [Axid] (rxnorm: 582620)\n    </div>"
  },
  "contained": [
    {
      "resourceType": "Medication",
      "id": "med",
      "name": "Nizatidine 15 MG/ML Oral Solution [Axid]",
      "code": {
        "coding": [
          {
            "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
            "code": "582620",
            "display": "Nizatidine 15 MG/ML Oral Solution [Axid]"
          }
        ]
      }
    }
  ],
  "status": "active",
  "patient": {
    "reference": "Patient/1032702"
  },
  "medication": 
  
     {
      "resourceType": "Medication",
      "id": "med",
      "name": "Nizatidine 15 MG/ML Oral Solution [Axid]",
      "code": {
        "coding": [
          {
            "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
            "code": "582620",
            "display": "Nizatidine 15 MG/ML Oral Solution [Axid]"
          }
        ]
      }
    }

  
  
  
  
  
  
  
  ,
  "dosageInstruction": [
    {
      "text": "10 mL bid",
      "timingSchedule": {
        "event": [
          {
            "start": "2008-04-05"
          }
        ],
        "repeat": {
          "frequency": 2,
          "duration": 1,
          "units": "d"
        }
      },
      "doseQuantity": {
        "value": 10,
        "units": "mL",
        "system": "http://unitsofmeasure.org",
        "code": "mL"
      }
    }
  ],
  "dispense": {
    "numberOfRepeatsAllowed": 1,
    "quantity": {
      "value": 1,
      "units": "mL",
      "system": "http://unitsofmeasure.org",
      "code": "mL"
    },
    "expectedSupplyDuration": {
      "value": 30,
      "units": "days",
      "system": "http://unitsofmeasure.org",
      "code": "d"
    }
  }
}		
		
		;
}])



.config(['$routeProvider',
				 function($routeProvider) {
					 $routeProvider
					 .when('/im/online', {
						 templateUrl: '/static/im_app/dialogs/online.html',
						 reloadOnSearch: false,
						 controller: 'onlineUsersCtrl'
					 })

					 ;
				 }])
