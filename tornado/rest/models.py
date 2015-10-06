# -*- coding: utf-8 -*-

import mongoengine
from mongoengine import fields
import datetime
import settings


class User(mongoengine.fields.Document):
    owner = mongoengine.fields.IntField()  # HermesUser.pk
    username = mongoengine.fields.StringField()  # HermesUser.username
    is_admin = mongoengine.fields.BooleanField(default=False)
    is_moderator = mongoengine.fields.BooleanField(default=False)
    is_expert = mongoengine.fields.BooleanField(default=False)
    other = fields.DictField()
"""
    SO queue
"""


class SOQueue(fields.Document):

    """
        obj={
            'assigned_by':<MainUser.pk>, #coordinator
            'user':<MainUser.pk>,#patient
            'assigned_to':<MainUser.pk>, #expert
            'date':<>, #date for user
            'assigned_date':<>, #date for coordinator
            'closed_date':<>, #date for expert
            'reopen_date':<>
            }
    """
    opened = fields.ListField(field=fields.DictField())
    in_progress = fields.ListField(field=fields.DictField())
    closed = fields.ListField(field=fields.DictField())
    reopened = fields.ListField(field=fields.DictField())
    processed_ = fields.ListField(field=fields.DictField())


"""
        Dialog models
"""
MAIL_TYPES = {"O": "Own",
              "I": "Incoming"
              }


class DialogPreferences(fields.Document):
    owner = fields.IntField()  # HermesUser.pk
    dialog_with_users = fields.ListField(
        fields.IntField(),  # HermesUser.pk
        default=[]
    )
    dialogs = fields.ListField(
        fields.StringField(),  # Dialog.pk
        default=[]
    )


class DialogMsg(fields.EmbeddedDocument):
    mail_type = fields.StringField(max_length=1, choices=MAIL_TYPES.items())
    text = fields.StringField()
    timestamp = fields.DateTimeField()
    """
        произвольные прикрепляемые объекты
    """
    objs = fields.DictField()


class Dialog(fields.Document):
    owner = fields.IntField()  # HermesUser.pk
    dialog = fields.ListField(
        fields.EmbeddedDocumentField(DialogMsg)
    )
    """
        тоже произвольный формат, но предпочтительно:
        {'pk':3, 'username':'MyNick'}
    """
    dialog_with_user = fields.DictField()
    dialog_with_user_pk = fields.IntField()
    last_msg_timestamp = fields.DateTimeField()
    unreaded_count = fields.IntField(default=0)


def connect():
    if settings.SERVER == 'localhost':
        mongoengine.connect('db_2')
    else:
        mongoengine.connect(host=settings.MONGODB_URL)
