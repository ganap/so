//
//
//
//		MODULE:::
//
//
//
angular.module('SO_Im')

.factory("$ws", ['djRest', function(djRest) {

	function $ws(){

		var SOCKET_SERVER, SOCKET_URL;

		this.socket=null;
		this.CALLBACKS={};
		this.RECONNECT=true;
		this.CONNECTED=false;

		this.UNREADED_COUNT=0;
		this.CREDENTIALS=null;
		this.sendSignal={};
		var self=this;


		//-----------------------
		//	
		//	Подключение/отключение обработчиков событий
		//

		this.subscribeCallback = function(event_type, callback){
			//	Подключает обработчики к сигналам от сервера.
			//	Доступные:
			/*
			   {"new_msg": <WallMsgObj> }  -  новое сообщение от пользователя.
			   {"all_msg": [<WallMsgObj> ...] } - все входящие сообщения.
			   {"wall_pref": <WallObj> } - изменения настроек почтового ящика.
			   {"i_read_all": "" }  -  уведомление о том, что пользователь
			   уже прочел все сообщения, но в другой вкладке в браузере или
			   на другом устройстве.
			   {"i_deleted_msg": <WallMsgObj.id> } - уведомление о том, что пользователь
			   удалил сообщение в другой вкладке или на другом устройстве.

			   {"error": <obj> } - ошибка в текстовом формате или json. поскольку приложение
			   асинхронное, то на месте <obj> будет находиться весь объект
			   который отослал клиент и который вызвал ошибку.
			   */

			if (!self.CALLBACKS.hasOwnProperty(event_type)){
				self.CALLBACKS[event_type]=[];
			}
			self.CALLBACKS[event_type].push(callback);
		}

		this.unsubscribeCallback = function(event_type, callback){
			if (self.CALLBACKS.hasOwnProperty(event_type)){
				var index=self.CALLBACKS[event_type].indexOf(callback);
				if (index>-1){
					self.CALLBACKS[event_type].splice(index,1);
				}
			}
		}

		//--------------------------------------
		//	Спец функции
		//


		this.sendMessage = function(event_type, obj){
			// Отправляет сообщение в сокет.
			// Доступные типы сообщений:
			/*
			   {"read_all": '' }  -  сообщение о том, что пользователь прочитал
			   все сообщения.
			   {"delete": <WallMsgObj> }  -  oid сообщения которое нужно удалить.
			   {"send_msg": <WallMsg> }  -  собственное сообщение, другому пользователю или себе.
			   */
			console.log(event_type, obj);
			var msg={};
			msg[event_type]=obj;
			self.socket.send(JSON.stringify(msg));
		}

		this.createSignal = function(event, func){
			this.sendSignal[event]=func;
		}


		//---------------------------
		//
		//	Обработчики событий
		//
		var onSocketDisconnect = function(message){
			self.CONNECTED=false;
			if (self.RECONNECT){
				setTimeout(
					self.connect(),
					2000
				);
			}
		}

		var onError = function(data){
			console.log(data);
		}


		//--------------------------------
		//	
		//	Подключение обработчиков к шине сообщений
		//
		//
		this.subscribeCallback('disconnect', onSocketDisconnect);
		this.subscribeCallback('error', onError);


		var Socket = {
			ws: null,
			init: function () {


				function runCallbacks(event_type, data){
					if (self.CALLBACKS.hasOwnProperty(event_type)){
						var callbacks=self.CALLBACKS[event_type];

						for (var i = 0; i < callbacks.length; i++) {
							callbacks[i](data);
						};

					}
					else{
						console.log(event_type, data);
					}
				}

				if (self.CONNECTED) return;

				if (location.hostname=='localhost'){
					SOCKET_SERVER='localhost:8888';
				}
				else{
					SOCKET_SERVER='104.155.31.77';
					//SOCKET_SERVER='146.148.116.83';
				}
				ws = new WebSocket('ws://' + SOCKET_SERVER +SOCKET_URL+self.CREDENTIALS.socket_user_oid+"/"+
									self.CREDENTIALS.username);
				ws.onopen = function (data) {
					self.CONNECTED=true;
					console.log('Socket for '+SOCKET_URL+': open');
					runCallbacks('connect', data);
				};

				ws.onclose = function (data) {
					console.log('Socket for '+SOCKET_URL+': close');
					runCallbacks('disconnect', data);
				};

				ws.onmessage = function (message) {
					var response=JSON.parse(message.data);
					var event_type=Object.keys(response)[0];

					runCallbacks(event_type, response[event_type]);
				};

				this.ws = ws;
			}
		};


		this.connect = function(server, url){
			if (server){
				SOCKET_SERVER=server;
			}
			if (url){
				SOCKET_URL=url;
			}
			if (!self.CREDENTIALS){
				djRest.OwnProfile.get(
					function(data){
						console.log(data);
						self.CREDENTIALS=[];
						self.CREDENTIALS['username']=data.username;
						self.CREDENTIALS['socket_user_oid']=data.socket_user_oid;
						if (!self.CONNECTED){
							self.connect()
						}
					}
				);
				return;
			}			

			try{
				self.socket.close();
				self.CONNECTED=false;
			}
			catch (e){
				self.CONNECTED=false;
			}
			Socket.init();
			self.socket = Socket.ws;
		}


	}
	return function(){
		return new $ws();
	}
	
}])

;
