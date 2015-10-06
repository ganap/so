# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from mongo_app import models as mongoapp_models
from model import mongodb, models


class Command(BaseCommand):
    args = ''
    help = 'Creates initial objects'

    def handle(self, *args, **options):
        mongodb.MongoDbConnect()
        self.stdout.write("::::Create Moderator queue...")

        mq = mongoapp_models.ModeratorQueue.objects(name="main")
        if not mq:
            mq = mongoapp_models.ModeratorQueue(name="main")
            mq.save()
        self.stdout.write("::::Create Site preferences...")
        sp = models.SitePreferences.objects.all()
        if not sp:
            models.SitePreferences.objects.create()

        self.stdout.write("::::END")
