#!-*- coding: utf-8 -*-
import websocket_app
import models
import helpers


class SOApp(websocket_app.AppSystem):
    pool_name = 'webSocketsPoolSO'

    def __init__(self, *args, **kwargs):
        super(SOApp, self).__init__(*args, **kwargs)
        self.registerCallback('open', self.callback_open)
        self.registerCallback('close', self.callback_close)
        #
        self.registerCallback('all_queue', self.callback_all_queue)
        self.registerCallback('open_so', self.callback_open_so)
        self.registerCallback('assign_to', self.callback_assign_to)
        self.registerCallback('move_so', self.callback_move_so)
        self.registerCallback('refuse', self.callback_refuse)
        self.registerCallback('cancel_so', self.callback_cancel_so)
                #
        self.registerCallback('admin_msg', self.callback_admin_msg)

    def get_or_create_SOQueue(self):
        queue = models.SOQueue.objects()
        if not queue:
            queue = models.SOQueue()
            queue.save()
            return queue
        return queue[0]

    def check_is_user_in(self, user_pk, queue_name):
        self.queue = self.get_or_create_SOQueue()
        queue = getattr(self.queue, queue_name)
        is_in_queue = False
        for obj in queue:
            if obj['user'] == user_pk:
                is_in_queue = True
                break
        return is_in_queue

    """
        SIGNALS
    """

    def signal_AllQueue(self):
        self.queue = self.get_or_create_SOQueue()
        if self.user.is_admin or self.user.is_moderator:
            print("MODERATOR")
            data = helpers.mongo_to_dict_helper2(self.queue)
            self.sendMsgToSelf('all_queue', data)
        else:
            if self.user.is_expert:
                field = 'assigned_to'
            else:
                field = 'user'
            # експерту и пациенту нужно отправить только то что ассоциировано с ним самим
            opened = []
            in_progress = []
            closed = []
            reopened = []
            processed_ = []
            for o in self.queue.opened:
                if o[field] == self.user.owner:
                    opened.append(o)
            for ip in self.queue.in_progress:
                if ip[field] == self.user.owner:
                    in_progress.append(ip)
            for c in self.queue.closed:
                if c[field] == self.user.owner:
                    closed.append(c)
            for r in self.queue.reopened:
                if r[field] == self.user.owner:
                    reopened.append(r)
            for r in self.queue.processed_:
                if r[field] == self.user.owner:
                    processed_.append(r)
            self.sendMsgToSelf(
                'all_queue',
                {
                    'opened': opened,
                    'in_progress': in_progress,
                    'closed': closed,
                    'reopened': reopened,
                    'processed_': processed_
                }
            )

    def signal_MoveSo(self, from_, to_, obj):
        msg = {
            'from': from_,
            'to': to_,
            'so': obj
        }
        self.sendMsgMegaToAll('move_so', msg)

    """
        CALLBACKS
    """

    def callback_cancel_so(self, obj):
        user_pk = obj.get('user_pk', None)
        if not user_pk:
            user_pk = self.user.owner
        self.queue = self.get_or_create_SOQueue()
        so = None
        for o in self.queue.opened:
            if o['user'] == user_pk:
                so = o
                break
        if so:
            self.queue.opened.remove(so)
            self.queue.save()
            self.signal_MoveSo('opened', None, so)
            return
        for ip in self.queue.in_progress:
            if ip['user'] == user_pk:
                so = ip
                break
        if so:
            self.queue.in_progress.remove(so)
            self.queue.save()
            self.signal_MoveSo('in_progress', None, so)
            return

    def callback_open_so(self, obj):
        if self.user.is_admin or self.user.is_moderator or self.user.is_expert:
            return
        so_obj = {
            'user': self.user.owner,
            'so_pk': obj['so_pk'],
            'assigned_by': 0,
            'assigned_to': 0,
            'date': helpers.timestamp_sec(),
            'assigned_date': None,
            'closed_date': None,
            'reopen_date': None,
        }
        self.queue = self.get_or_create_SOQueue()
        if self.check_is_user_in(self.user.owner, 'opened'):
            return

        self.queue.opened.append(so_obj)
        self.queue.save()
        self.signal_MoveSo(None, 'opened', so_obj)

    def callback_assign_to(self, obj):
        if self.user.is_admin or self.user.is_moderator:
            to_user_pk = obj['to_user_pk']
            obj = obj['so']
            self.queue = self.get_or_create_SOQueue()
            print(obj)
            del obj['$$hashKey']
            print(self.queue.opened)
            self.queue.opened.remove(obj)
            obj['assigned_by'] = self.user.owner
            obj['assigned_to'] = to_user_pk
            obj['assigned_date'] = helpers.timestamp_sec()
            self.queue.opened.append(obj)
            self.queue.save()
            self.signal_MoveSo('opened', 'opened', obj)
            # добавляем доктора к людям, которые могут просматривать
            # профиль
            url = "/api/v1/patients/" + str(obj['user']) + "/permissions/"
            data = {
                'user': to_user_pk,
                'action': 'append'
            }
            helpers.http_put(url, data)

    def callback_refuse(self, obj):
        obj = obj['so']
        del obj['$$hashKey']
        self.queue = self.get_or_create_SOQueue()
        if self.user.is_admin or self.user.is_moderator:
            try:
                self.queue.opened.remove(obj)
                from_ = 'opened'
            except:
                pass
            try:
                self.queue.in_progress.remove(obj)
                from_ = 'in_progress'
            except:
                pass
            # удаляем доктора
            url = "/api/v1/patients/" + str(obj['user']) + "/permissions/"
            data = {
                'user': obj['assigned_to'],
                'action': 'remove'
            }
            helpers.http_put(url, data)
            obj['assigned_to'] = 0
            obj['assigned_date'] = None
            self.queue.opened.append(obj)
            self.queue.save()
            self.signal_MoveSo(from_, 'opened', obj)
        if self.user.is_expert:
            print("REFUSE")
            if obj['assigned_to'] != self.user.owner:
                return
            try:
                self.queue.opened.remove(obj)
                from_ = 'opened'
            except:
                pass
            try:
                self.queue.in_progress.remove(obj)
                from_ = 'in_progress'
            except:
                pass
            # удаляем доктора
            url = "/api/v1/patients/" + str(obj['user']) + "/permissions/"
            data = {
                'user': obj['assigned_to'],
                'action': 'remove'
            }
            print(data)
            helpers.http_put(url, data)
            obj['assigned_to'] = 0
            obj['assigned_date'] = None
            self.queue.opened.append(obj)
            self.queue.save()
            print("SENDINGMES")
            self.signal_MoveSo(from_, 'opened', obj)

    def callback_move_so(self, obj):
        if self.user.is_expert:
            # только он может переносить so меж ['opened', 'in_progress', 'processed'] состояниями.
            to_ = obj['to']
            from_ = obj['from']
            if to_ not in ['in_progress', 'processed_']:
                return
            if from_ not in ['opened', 'in_progress']:
                return
            # пытаемся перенести объект
            self.queue = self.get_or_create_SOQueue()
            obj = obj['so']
            if 'user' not in obj:
                for so in getattr(self.queue, from_):
                    print(so, obj)
                    if so['so_pk'] == obj['so_pk']:
                        obj = dict(so)
                        break
            try:
                del obj['$$hashKey']
            except:
                pass
            print(obj)
            print(self.queue.to_json())
            print(from_, to_)
            if from_ == 'opened':
                self.queue.opened.remove(obj)
            elif from_ == 'in_progress':
                self.queue.in_progress.remove(obj)
            if to_ == 'in_progress':
                self.queue.in_progress.append(obj)
            elif to_ == 'processed_':
                self.queue.processed_.append(obj)

            self.queue.save()
            self.signal_MoveSo(from_, to_, obj)

    def callback_admin_msg(self, obj):
        if 'remove_opened_in_progress' in obj.keys():
                user_pk = obj['remove_opened_in_progress']['user_pk']
                so_pk = obj['remove_opened_in_progress']['so_pk']
                queue = self.get_or_create_SOQueue()
                for so in queue.opened:
                    if so['so_pk'] == so_pk:
                        queue.opened.remove(so)
                        queue.save()
                        self.signal_MoveSo('opened', None, so)
                        break
                queue = self.get_or_create_SOQueue()
                for so in queue.in_progress:
                    if so['so_pk'] == so_pk:
                        queue.in_progress.remove(so)
                        queue.save()
                        self.signal_MoveSo('in_progress', None, so)
                        break
        if 'open_so' in obj.keys():
                print("Open SO")
                so_pk = obj['open_so']['so_pk']
                so_obj = {
                    'user': obj['open_so']['user_pk'],
                    'so_pk': so_pk,
                    'assigned_by': 0,
                    'assigned_to': 0,
                    'date': helpers.timestamp_sec(),
                    'assigned_date': None,
                    'closed_date': None,
                    'reopen_date': None,
                }
                self.queue = self.get_or_create_SOQueue()
                if self.check_is_user_in(self.user.owner, 'opened'):
                    return

                self.queue.opened.append(so_obj)
                self.queue.save()
                self.signal_MoveSo(None, 'opened', so_obj)
        if 'close_so' in obj.keys():
                so_pk = obj['close_so']['so_pk']
                queue = self.get_or_create_SOQueue()
                for so in queue.processed_:
                    if so['so_pk'] == so_pk:
                        queue.processed_.remove(so)
                        queue.closed.append(so)
                        queue.save()
                        self.signal_MoveSo('processed_', 'closed', so)
                        break

    def callback_all_queue(self, obj=None):
        self.signal_AllQueue()

    def callback_open(self, obj):
        # models.SOQueue.objects().delete()
        print("OPEN")
        # models.Dialog.objects().delete()
        # models.DialogPreferences.objects().delete()
        pool = getattr(self.application, self.pool_name, None)
        if not pool:
            self.application.webSocketsPoolSO = {}
        """
            Добавляем новый сокет в пулл соединений
        """
        if self.user.owner not in self.application.webSocketsPoolSO.keys():
            self.application.webSocketsPoolSO[self.user.owner] = []
            self.application.webSocketsPoolSO[
                self.user.owner].append(self)
        if self not in self.application.webSocketsPoolSO[self.user.owner]:
            self.application.webSocketsPoolSO[
                self.user.owner].append(self)
        self.signal_AllQueue()

    def callback_close(self, obj):
        if self.user.owner not in self.application.webSocketsPoolSO.keys():
            return
        if self in self.application.webSocketsPoolSO[self.user.owner]:
            self.application.webSocketsPoolSO[
                self.user.owner].remove(self)
        if not len(self.application.webSocketsPoolSO[self.user.owner]):
            del self.application.webSocketsPoolSO[self.user.owner]
