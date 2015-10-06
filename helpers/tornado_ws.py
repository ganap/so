# -*- coding: utf-8 -*-
import websocket
from django.conf import settings
import json


class WS:

    def __init__(self, on_message, on_error, on_close, on_open, URL='/'):
        self.on = {
            'on_message': on_message,
            'on_error': on_error,
            'on_close': on_close,
        }
        websocket.enableTrace(True)
        self.ws = websocket.WebSocketApp("ws://" + settings.TORNADO_WS_SERVER + URL +
                                         settings.TORNADO_API_KEY.split(
                                             '-')[0] + "/admin",
                                         on_message=self.on_message,
                                         on_error=self.on_error,
                                         on_close=self.on_close)
        self.ws.on_open = on_open

        self.ws.run_forever()

    def on_message(self, ws, message):
        if self.on['on_message']:
            self.on['on_message'](message)

    def on_error(self, ws, error):
        if self.on['on_error']:
            self.on['on_error'](error)

    def on_close(self, ws):
        if self.on['on_close']:
            self.on['on_close']()


def sendSOMsg(user_pk, action_obj):
    def on_open(ws=None):
        ws.send(json.dumps({'admin_msg': action_obj}))
        ws.close()
    ws = WS(None, None, None, on_open, URL='/websocket/so/')
