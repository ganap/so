# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
import helpers


class Command(BaseCommand):
    args = ''
    help = 'Update db for all entry in models.SUBREDDIT_NAMES'

    def handle(self, *args, **options):
        helpers.MongoDbConnect()
        self.stdout.write("::::Dropping db")

        # L18n_models.City.objects().delete()
        # L18n_models.Country.objects().delete()
        self.stdout.write("::::END")
