# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from L18n import models
from django.conf import settings
import helpers
import os

import gzip
import shutil


CLIST_DIR = settings.BASE_DIR + "/L18n/clist/"


class Command(BaseCommand):
    args = ''
    help = 'Fill country & city in db from clist files'

    def handle(self, *args, **options):
        helpers.MongoDbConnect()
        self.stdout.write("::::Fill Country And City in DB")

        for file_name in os.listdir(CLIST_DIR):
            f = open(CLIST_DIR + file_name)
            country_obj = eval(f.read())
            f.close()
            country_name = file_name.replace(".clist", "")

            try:
                self.stdout.write("::::Creating " + country_name)
            except:
                self.stdout.write("==>Cant decode country name")
            #
            #   Create country mongodb object
            #
            country = models.DjCountry.objects.create(name=country_name,
                                                      code=country_obj['code'])
            for c in country_obj['city_list']:
                try:
                    self.stdout.write("::::Creating for " + country_name
                                      + " city " + c['name'])
                except:
                    self.stdout.write("=======>Error")
                city = models.DjCity.objects.create(name=c['name'],
                                                    country=country,
                                                    location=c['coordinates'])
                # country.city_list.append(city)
            # country.save()

        self.stdout.write("::::END")
