#!/usr/bin/env python
#!-*- coding: utf-8 -*-


import tornado.web
import tornado.ioloop
import tornado.httpserver
import os
from django.conf import settings
settings.configure()
from rest import auth, site_communication, websocket_dialog, websocket_so
PATH = os.path.dirname(__file__)
print(PATH)


class Application(tornado.web.Application):

    def __init__(self):
        self.webSocketsPool = []

        settings = {
            'debug': True,
            'static_path': os.path.join(PATH, 'static')
        }

        handlers = (
            #(r'/(?P<chat_oid>[^/]+)?', MainHandler2),

            (r'', tornado.web.StaticFileHandler,
             {'path': os.path.join(PATH, 'static', 'index.html')}),

            # login
            (r'/api/v1/login/?', auth.Auth),

            # rooms management. for POST need API_KEY
            #(r'/api/v1/chat-rooms/?', site_communication.ChatRoom),

            #(r'/api/v1/chat-rooms/(?P<chat_room_oid>[^/]+)?',
            # site_communication.ChatRoomSingle),

            # user management. for POST need API_KEY
            (r'/api/v1/users/?', site_communication.HermesUser),

            # websocket apps
            (r'/websocket/dialogs/(?P<user_oid>[^/]+)/(?P<username>[^/]+)?',
             websocket_dialog.DialogApp),
            (r'/websocket/so/(?P<user_oid>[^/]+)/(?P<username>[^/]+)?',
             websocket_so.SOApp),

        )

        tornado.web.Application.__init__(self, handlers,
                                         **settings)

application = Application()

application.webSocketsPool = {}
application.membersOnline = []

SERVER = os.environ.get("SERVER", None)
if SERVER == 'localhost':
    application.listen(8888)
else:
    application.listen(80)
# http_server = tornado.httpserver.HTTPServer(application)

# http_server.listen(8888)
tornado.ioloop.IOLoop.instance().start()
