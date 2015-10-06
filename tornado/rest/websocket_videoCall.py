#!-*- coding: utf-8 -*-
import websocket_app
import models
import serializers
import helpers


from pytz import utc
from datetime import datetime


class VideoCallApp(websocket_app.AppSystem):
    pool_name = "webSocketsPoolVideoCalls"

    def __init__(self, *args, **kwargs):
        super(VideoCallApp, self).__init__(*args, **kwargs)
        self.registerCallback('open', self.callback_open)
        self.registerCallback('close', self.callback_close)
        self.registerCallback('call', self.callback_call)

    """
        SIGNALS
    """

    def signal_Online(self):
        print('online')
        print(self.application.webSocketsPoolVideoCalls)
        for user_pk in self.application.webSocketsPoolVideoCalls.keys():

            self.sendMsgToAll("online",
                              {'users':
                               self.application.webSocketsPoolVideoCalls.keys(
                               )},
                              user_pk)

    """
        CALLBACKS
    """

    def callback_call(self, obj):
        room = str(helpers.timestamp_sec())
        print(obj)
        self.sendMsgToAll('incoming_call', {'user': self.user.owner,
                                            'room': room},
                          user_pk=obj['to_user_pk'])
        self.sendMsgToSelf("call", {'room': room})

    def callback_open(self, obj):
        print('on_open')
        """
            Пулл соединений
        """
        pool = getattr(self.application, 'webSocketsPoolVideoCalls', None)
        if not pool:
            self.application.webSocketsPoolVideoCalls = {}

        """
            Добавляем новый сокет в пулл соединений
        """

        if self.user.owner not in self.application.webSocketsPoolVideoCalls.keys():
            self.application.webSocketsPoolVideoCalls[self.user.owner] = []
        if self not in self.application.webSocketsPoolVideoCalls[self.user.owner]:
            self.application.webSocketsPoolVideoCalls[
                self.user.owner].append(self)
        """
            Отсылаем все диалоги и настройки:
        """
        self.signal_Online()

    def callback_close(self, obj):
        print("CLOSE")
        if self.user.owner not in self.application.webSocketsPoolVideoCalls.keys():
            return
        if self in self.application.webSocketsPoolVideoCalls[self.user.owner]:
            self.application.webSocketsPoolVideoCalls[
                self.user.owner].remove(self)
        if not len(self.application.webSocketsPoolVideoCalls[self.user.owner]):
            del self.application.webSocketsPoolVideoCalls[self.user.owner]
        self.signal_Online()
