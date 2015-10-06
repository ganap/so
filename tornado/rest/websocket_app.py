#!-*- coding: utf-8 -*-
import tornado.websocket
import models
import settings
import json


def json_encode(obj):
    return json.dumps(obj)


class AppSystemHelpers:
    pool_name = ''

    def getPool(self):
        obj = getattr(self.application, self.pool_name)
        return obj

    def sendMsgMegaToAll(self, command, obj):
        msg = json_encode({command: obj})
        pool = self.getPool()
        for user in pool.keys():
            print("SEND TO USER IN MEGA==" + str(user))
            for socket in pool[user]:
                print("SEND TO SOCKET" + repr(socket))
                socket.ws_connection.write_message(msg)

    def sendMsgToAll(self, command, obj, user_pk=None):
        if not user_pk:
            user_pk = self.user.owner
        if not self.getPool().has_key(user_pk):
            return
        msg = json_encode({command: obj})
        for socket in self.getPool()[user_pk]:
            socket.ws_connection.write_message(msg)

    def sendMsgToAllExceptSelf(self, command, obj, user_pk=None):
        if not user_pk:
            user_pk = self.user.owner
        if not self.getPool().has_key(user_pk):
            return
        msg = json_encode({command: obj})
        for socket in self.getPool()[self.user.owner]:
            if socket != self:
                socket.ws_connection.write_message(msg)

    def sendMsgToSelf(self, command, obj):
        msg = json_encode({command: obj})
        self.ws_connection.write_message(msg)

    def signal_Error(self, json_error):
        """
            при любой ошибке вызывается эта функция.
        """
        self.sendMsgToSelf('error', json_error)


class AppSystem(tornado.websocket.WebSocketHandler, AppSystemHelpers):

    def check_origin(self, origin):
        return True

    def registerCallback(self, name, func):
        c = getattr(self, 'CALLBACKS', None)
        if not c:
            self.CALLBACKS = {'open': [], 'close': []}

        if name not in self.CALLBACKS.keys():
            self.CALLBACKS[name] = []
        self.CALLBACKS[name].append(func)

    def runCallback(self, name, obj):
        if name in self.CALLBACKS.keys():
            for c in self.CALLBACKS[name]:
                c(obj)

    def open(self, user_oid, username):

        models.connect()
        self.subscribe_pk = None
        try:
            user = models.User.objects.get(pk=user_oid)
            if username == user.username:
                self.user = user
            else:
                self.user = None
        except:
            self.user = None
        print(user_oid, username)
        print(self.user)
        if username == "admin" and self.user == None:
            if settings.HERMES_API_KEY.split('-')[0] == user_oid:
                class Admin:

                    def __init__(self):
                        self.owner = 0
                        self.is_admin = True
                self.user = Admin()
        if not self.user:
            return

        self.runCallback('open', None)

    def on_message(self, message):
        if self.user == None:
            self.ws_connection.write_message(
                '{"error":["Your not logged in."]}'
            )
            return
        message_dict = json.loads(message)
        commands = message_dict.keys()
        for key in commands:
            self.runCallback(key, message_dict[key])

    def on_close(self, message=None):
        user = getattr(self, 'user', None)
        if not user:
            return
        self.runCallback('close', user)
