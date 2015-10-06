# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from model import mongodb
from L18n import models
from django.conf import settings
import os

import gzip
import shutil


AUTO_GEN_DIR = settings.STATICFILES_DIRS[0] + "gen/"


def gz_compress_file(file_path):
    with open(file_path, 'rb') as f_in, gzip.open(file_path + ".gz", 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)


def rm_spaces(line):
    line = line.replace(" u'", "'")
    line = line.replace("', '", "','")
    return line


class Command(BaseCommand):
    args = ''
    help = 'Update country city list files from db'

    def handle(self, *args, **options):
        mongodb.MongoDbConnect()
        self.stdout.write(
            "::::Regenerate Country And City list files in /static/gen/L18n/country-city/")
        locales = models.Locales.objects()
        locale_suffixes = []
        for locale in locales:
            locale_suffixes.append(locale.alias)
        #
        #   Get all countries and save them to files
        #

        countries_locales = {}
        for s in locale_suffixes:
            countries_locales[s] = {
                #   '3489284jdsjII293jJ': 'France',
                #   ...
            }

        for country in models.Country.objects():
            pk = str(country.pk)
            for locale in locale_suffixes:
                names = country.name_locale
                name = names.get(locale, None)
                if name:
                    countries_locales[locale][pk] = name
                else:
                    countries_locales[locale][pk] = country.name

        for locale in locale_suffixes:
            file_path = AUTO_GEN_DIR + "L18n/country-city/country-list."\
                + locale + ".json"
            f = open(file_path, "w")
            data = repr(countries_locales[locale])
            data = rm_spaces(data)
            f.write(data)
            f.close()
            gz_compress_file(file_path)

        self.stdout.write("::::County list      [DONE]")
        #
        #   Get all City from country and save them
        #   in folder with Country.oid
        #
        for country in models.Country.objects():
            pk = str(country.pk)
            country_dir = AUTO_GEN_DIR + "L18n/country-city/" + pk + "/"
            if not os.path.isdir(country_dir):
                os.mkdir(country_dir)
            for locale in locale_suffixes:
                city_dict = {}
                for city in country.city_list:
                    city_pk = str(city.pk)
                    names = city.name_locale
                    name = names.get(locale, None)
                    if name:
                        city_dict[city_pk] = name
                    else:
                        city_dict[city_pk] = city.name

                file_path = country_dir + "city-list." + locale + ".json"
                f = open(file_path, "w")
                data = rm_spaces(repr(city_dict))
                f.write(data)
                f.close()
                gz_compress_file(file_path)
            self.stdout.write("::::City list for "
                              + country.name + "         [DONE]")

        self.stdout.write("::::END")
