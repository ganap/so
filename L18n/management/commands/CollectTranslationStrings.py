# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from model import mongodb
from L18n import models

from django.conf import settings
import os
import tr_parsers

FILE_TYPES = {
    #'.py': tr_parsers.PyJsTranslationFind,
    #'.html': tr_parsers.HtmlTranslationFind,
    #'.js': tr_parsers.PyJsTranslationFind,
    'model_types.py': tr_parsers.PyModuleConstantsFind,
}


SKIP_DIR = ['hermes', 'gen', 'countryStateCity']
SKIP_FILE = ['tr_parsers.py']

STRING_TO_TRANSLATE = {}


class Command(BaseCommand):
    args = ''
    help = 'Collects All String'

    def add_tr(self, tr_list, filepath):
        for tr in tr_list:
            if tr not in STRING_TO_TRANSLATE.keys():
                STRING_TO_TRANSLATE[tr] = []
            if filepath not in STRING_TO_TRANSLATE[tr]:
                STRING_TO_TRANSLATE[tr].append(filepath)

    def handle(self, *args, **options):
        mongodb.MongoDbConnect()
        models.Translation.objects().delete()

        def collect_from_dir(d):
            listdir = os.listdir(d)
            for path in listdir:
                filepath = os.path.join(d, path)
                ext = os.path.splitext(filepath)[-1]
                if ext in FILE_TYPES.keys() and path not in SKIP_FILE:
                    tr = FILE_TYPES[ext](filepath)
                    tr.find_tr()
                    self.add_tr(tr.tr, filepath)
                if path in FILE_TYPES.keys():
                    tr = FILE_TYPES[path](filepath)
                    tr.find_tr()
                    self.add_tr(tr.tr, filepath)

                if os.path.isdir(filepath) and path[0] != '.' and path not in SKIP_DIR:
                    collect_from_dir(filepath)

        collect_from_dir(settings.BASE_DIR)

        for t in STRING_TO_TRANSLATE.keys():
            tr = models.Translation.objects(line=t)
            if not tr:
                tr = models.Translation(
                    line=t,
                    occurance=STRING_TO_TRANSLATE[t]
                )
                tr.save()
            self.stdout.write("}}}}}}}}}}}}}}}" + repr(t))
            self.stdout.write(repr(STRING_TO_TRANSLATE[t]))

        self.stdout.write("::::END")
