#!-*- coding: utf-8 -*-
import websocket_app
import models
import serializers
import helpers


from pytz import utc
from datetime import datetime


class DialogApp(websocket_app.AppSystem):
    pool_name = 'webSocketsPoolDialogs'

    def __init__(self, *args, **kwargs):
        super(DialogApp, self).__init__(*args, **kwargs)
        self.registerCallback('open', self.callback_open)
        self.registerCallback('close', self.callback_close)
        # video calls
        self.registerCallback('call', self.callback_call)
        self.registerCallback('cancel_call', self.callback_cancel_call)
        # chat
        self.registerCallback('dialog_msg_list', self.callback_dialog_msg_list)
        self.registerCallback('send_msg', self.callback_send_msg)
        self.registerCallback('mark_as_readed', self.callback_mark_as_readed)

    def get_or_create_DialogPref(self, user_pk):
        df = getattr(self, 'dialog_pref', None)
        if df:
            df = models.DialogPreferences.objects.get(pk=str(df.pk))
            return df

        df = models.DialogPreferences.objects(owner=user_pk)
        if not df:
            df = models.DialogPreferences(owner=user_pk)
            df.save()
        else:
            df = df[0]
        return df

    def get_or_create_Dialog(self, with_user_pk, user=None):
        if not user:
            user = self.user
        print ("GET DIALOG")
        print(with_user_pk, user.to_json())
        d = models.Dialog.objects(owner=user.owner,
                                  dialog_with_user_pk=with_user_pk)
        print(d.to_json())
        print("================")
        if not d:
            with_user = models.User.objects(owner=with_user_pk)[0]
            d = models.Dialog(owner=user.owner,
                              dialog_with_user_pk=with_user_pk,
                              dialog_with_user={
                              'pk': with_user_pk,
                              'username': with_user.username,
                              },
                              last_msg_timestamp=helpers.timestamp())
            d.save()
            return d
        else:
            return d[0]

    def append_msg_to_dialog(self, dialog, **kwargs):
        now = datetime.utcnow().replace(tzinfo=utc)
        dmsg = models.DialogMsg(timestamp=now,
                                **kwargs)
        dialog.dialog.append(dmsg)
        dialog.last_msg_timestamp = now
        mail_type = kwargs.get('mail_type', None)
        if mail_type != 'O':
            dialog.unreaded_count += 1
        dialog.save()
        return (dialog, dmsg)
    """
        SIGNALS
    """

    def signal_Online(self, self_only=False):
        online = self.getPool().keys()
        online_users = {}
        for u in online:
            user = models.User.objects.get(owner=u)
            online_users[u] = user.username

        if self_only:
            self.sendMsgToSelf("online",
                               {'users': online_users})
            return

        for user_pk in self.getPool().keys():
            self.sendMsgToAll("online",
                              {'users': online_users},
                              user_pk)

    def signal_DialogList(self):
        dialogs = models.Dialog.objects(owner=self.user.owner)
        data = []
        for d in dialogs:
            data.append(
                helpers.mongo_to_dict_helper2(
                    d, fields=[
                        'owner', 'dialog_with_user', 'last_msg_timestamp',
                        'unreaded_count'])
            )
        self.sendMsgToSelf('dialog_list', data)

    def signal_DialogPref(self):
        data = serializers.DialogPreferencesSerializer(self.dialog_pref)
        self.sendMsgToSelf('dialog_pref', data.data)

    def signal_DialogMsgList(self, with_user_pk, dialog_msg_list):
        data = []
        for d in dialog_msg_list:
            data.append(
                helpers.mongo_to_dict_helper2(d)
            )
        self.sendMsgToSelf('dialog_msg_list', {
            'dialog_with_user_pk': with_user_pk,
            'dialogs': data
        })

    def signal_DialogMsg(self, with_user, dialog_msg, dialog, to_user_pk):
        data = helpers.mongo_to_dict_helper2(dialog_msg)
        print(data)
        self.sendMsgToAll('dialog_msg', {
            'dialog_msg': data,
            'dialog_with_user_pk': with_user.owner,
            'dialog_with_user': {
                'pk': with_user.owner,
                'username': with_user.username
            },
            'unreaded_count': dialog.unreaded_count
        }, to_user_pk)

    def signal_ReadedDialog(self, with_user_pk, dialog, to_user_pk):
        self.sendMsgToAll('readed_dialog', {
            'dialog_with_user_pk': with_user_pk,
            'unreaded_count': 0
        }, to_user_pk)

    """
        CALLBACKS
    """

    def callback_mark_as_readed(self, obj):
        with_user_pk = obj['with_user_pk']
        dialog = self.get_or_create_Dialog(with_user_pk)
        dialog.unreaded_count = 0
        dialog.save()
        self.signal_ReadedDialog(with_user_pk, dialog, self.user.owner)

    def callback_call(self, obj):
        room = str(int(helpers.timestamp_sec() / 10)) + self.user.username
        self.sendMsgToAll('incoming_call', {'user': self.user.owner,
                                            'username': self.user.username,
                                            'room': room},
                          user_pk=int(obj['to_user_pk']))
        user = models.User.objects.get(owner=int(obj['to_user_pk']))
        self.sendMsgToSelf(
            "call", {'room': room, 'user': int(obj['to_user_pk']),
                     'username': user.username})

    def callback_cancel_call(self, obj):
        self.sendMsgToAll('cancel_call', {'from_user_pk': self.user.owner},
                          int(obj['to_user_pk']))

    def callback_open(self, obj):
        print("OPEN")
        # models.Dialog.objects().delete()
        # models.DialogPreferences.objects().delete()
        pool = getattr(self.application, self.pool_name, None)
        if not pool:
            self.application.webSocketsPoolDialogs = {}
        self.dialog_pref = self.get_or_create_DialogPref(self.user.owner)
        """
            Добавляем новый сокет в пулл соединений
        """
        if self.user.owner not in self.application.webSocketsPoolDialogs.keys():
            self.application.webSocketsPoolDialogs[self.user.owner] = []
            self.application.webSocketsPoolDialogs[
                self.user.owner].append(self)
            self.signal_Online()
        if self not in self.application.webSocketsPoolDialogs[self.user.owner]:
            self.application.webSocketsPoolDialogs[
                self.user.owner].append(self)
        print(self.application.webSocketsPoolDialogs)
        """
            Отсылаем все диалоги и настройки:
        """
        self.signal_DialogPref()
        self.signal_DialogList()
        self.signal_Online(True)

    def callback_close(self, obj):
        if self.user.owner not in self.application.webSocketsPoolDialogs.keys():
            return
        if self in self.application.webSocketsPoolDialogs[self.user.owner]:
            self.application.webSocketsPoolDialogs[
                self.user.owner].remove(self)
        if not len(self.application.webSocketsPoolDialogs[self.user.owner]):
            del self.application.webSocketsPoolDialogs[self.user.owner]
            self.signal_Online()

    def callback_send_msg(self, obj):
        with_user_pk = obj['with_user_pk']
        del obj['with_user_pk']
        with_user = models.User.objects.get(owner=with_user_pk)
        dialog = self.get_or_create_Dialog(with_user_pk)
        """
            Создаем и сохраняем сообщение в списке текущего пользователя
        """
        dialog, dmsg = self.append_msg_to_dialog(dialog,
                                                 text=obj['text'],
                                                 mail_type='O',
                                                 objs=obj.get('objs', {}))
        print("own dialog")
        print(dialog.to_json())
        self.signal_DialogMsg(with_user, dmsg, dialog, self.user.owner)
        dialog_pref = self.get_or_create_DialogPref(self.user.owner)
        if with_user_pk not in dialog_pref.dialog_with_users:
            dialog_pref.dialog_with_users.append(with_user_pk)
            dialog_pref.save()

        """
            Теперь сохраняем дубликат в диалоге второго пользователя
        """
        dialog = self.get_or_create_Dialog(self.user.owner, with_user)
        dialog, dmsg = self.append_msg_to_dialog(dialog,
                                                 text=obj['text'],
                                                 mail_type='I',
                                                 objs=obj.get('objs', {}))
        self.signal_DialogMsg(self.user, dmsg, dialog, with_user.owner)

        dialog_pref = self.get_or_create_DialogPref(with_user_pk)
        if self.user.owner not in dialog_pref.dialog_with_users:
            dialog_pref.dialog_with_users.append(self.user.owner)
            dialog_pref.save()

    def callback_dialog_msg_list(self, obj):
        with_user_pk = obj['with_user_pk']
        offset = obj.get('offset', 0)
        dialog = self.get_or_create_Dialog(with_user_pk)
        print(dialog.to_json())
        self.signal_DialogMsgList(with_user_pk, dialog.dialog)
