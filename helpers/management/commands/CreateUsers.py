# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from helpers import users
from profiles import models
from helpers import mongodb
from fhir_profiles import users as fhir_users
import datetime
USERS = {
    'test1': {"email": 'hello@c.com',
              "is_expert": False,
              "is_admin": True,
              "is_moderator": False
              },
    'test2': {"email": 'hello2@c.com',
              "is_expert": False,
              "is_admin": False,
              "is_moderator": True
              },
    'test3': {"email": 'hello3@c.com',
              "is_expert": False,
              "is_admin": False,
              "is_moderator": True
              },
}
LANG = {
    'English': 'en',
    'Russian': 'ru'
}


class Command(BaseCommand):
    args = ''
    help = 'Update db for all entry in models.SUBREDDIT_NAMES'

    def handle(self, *args, **options):
        mongodb.MongoDbConnect()
        fhir_users.Patient.objects().delete()
        models.MainUser.objects.all().delete()

        for u in USERS.keys():
            self.stdout.write("::::Create user = " + u)
            users.CreateUser(
                u, USERS[u]['email'], password="1111a", unittest=True,
                is_admin=USERS[u]['is_admin'],
                is_moderator=USERS[u]['is_moderator'],
                is_expert=USERS[u]['is_expert'],
            )
        user = models.MainUser.objects.filter(username='test1')[0]

        user.is_admin = True
        user.save()

        user = models.MainUser.objects.filter(username='test2')[0]
        user.is_moderator = True
        user.save()

        user = models.MainUser.objects.filter(username='test3')[0]
        user.is_moderator = True
        user.save()
        self.stdout.write("::::END")
