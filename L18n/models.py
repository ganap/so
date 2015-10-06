# -*- coding: utf-8 -*-
import mongoengine
from django.db import models
import fields


class Locales(mongoengine.Document):

    """
        locales={
                'name':'Russian',
                'alias':'ru'
            }
    """
    name = mongoengine.fields.StringField()
    alias = mongoengine.fields.StringField(max_length=2)


class Translation(mongoengine.Document):

    """
        translation={
                'available_locales':['ru', 'uk'],
                'translation':{
                        'en':'Hello World!',
                        'ru':'Привет, мир!',
                        'uk':'Привiт, cвiту!'
                    }
            }
    """
    available_locales = mongoengine.fields.ListField(
        mongoengine.fields.StringField()
    )
    translation = mongoengine.DictField()
    line = mongoengine.fields.StringField()
    occurance = mongoengine.fields.ListField(
        field=mongoengine.fields.StringField()
    )

    def tr(self, locale):
        if locale in self.available_locales:
            return self.translation[locale]
        return self.line


"""

class City(mongoengine.Document):
    name = mongoengine.fields.StringField()
    # name_locale={'en':'London', 'ru': 'Лондон'}
    name_locale = mongoengine.fields.DictField()
    location = mongoengine.fields.PointField(default=[0, 0])


class Country(mongoengine.Document):
    name = mongoengine.fields.StringField()

    name_locale = mongoengine.fields.DictField()
    code = mongoengine.fields.StringField()  # 'us', 'ua', etc.
    city_list = mongoengine.fields.ListField(
        mongoengine.ReferenceField(City)
    )
"""


class DjCountry(models.Model):
    name = models.CharField(max_length=150, unique=True)
    name_locale = fields.DictionaryField()
    code = models.CharField(max_length=2)


class DjCity(models.Model):
    name = models.CharField(max_length=150)
    name_locale = fields.DictionaryField()
    location = fields.ListField()
    country = models.ForeignKey(DjCountry)
