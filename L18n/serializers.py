from restmongo import serializers as serializers_mongo
import models
from rest_framework import serializers


class LocalesSerializer(serializers_mongo.ModelSerializer):

    class Meta:
        model = models.Locales
        fields = ('pk', 'name', 'alias')
        extra_kwargs = {'read_only': ('pk', )
                        }


class TranslationSerializer(serializers_mongo.ModelSerializer):

    class Meta:
        model = models.Translation
        fields = ('pk', 'available_locales', 'translation', 'line',
                  'occurance')
        extra_kwargs = {'read_only': ('pk', )
                        }

"""

class CitySerializer(serializers_mongo.ModelSerializer):

    location = serializers_mongo.DictField(
        required=False
    )

    class Meta:
        model = models.City
        fields = ('pk', 'name', 'location')
        extra_kwargs = {'read_only': ('pk', 'location')
                        }


class CountrySerializer(serializers_mongo.ModelSerializer):

    class Meta:
        model = models.Country
        fields = ('pk', 'name', 'city_list', 'code')
        list_fields = {
            'city_list': models.City,
        }
        extra_kwargs = {'read_only': ('pk', )
                        }

"""


class DjCity(serializers.HyperlinkedModelSerializer):
    location = serializers.SerializerMethodField()
    name_locale = serializers.SerializerMethodField()

    def get_location(self, obj):
        return obj.location

    def get_name_locale(self, obj):
        return obj.name_locale

    class Meta:
        model = models.DjCity
        fields = ('pk', 'name', 'name_locale', 'location')


class DjCountry(serializers.HyperlinkedModelSerializer):
    name_locale = serializers.SerializerMethodField()
    city_list = serializers.SerializerMethodField()

    def get_city_list(self, obj):
        city_list = models.DjCity.objects.filter(country=obj)
        data = DjCity(city_list, many=True)
        return data.data

    def get_name_locale(self, obj):
        return obj.name_locale

    class Meta:
        model = models.DjCountry
        fields = ('pk', 'name', 'name_locale', 'code', 'city_list')
