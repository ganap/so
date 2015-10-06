from rest_framework_mongoengine.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView

from L18n import serializers
from L18n import models
from restmongo import permissions as restmongo_permissions, rest
from rest_framework import viewsets

from rest_framework.response import Response
from rest_framework import status
import helpers

helpers.MongoDbConnect()


class TranslationList(ListCreateAPIView):
    serializer_class = serializers.TranslationSerializer
    queryset = models.Translation.objects.all()
    # permission_classes = (restmongo_permissions.IsAdminOrReadOnly,)


class TranslationDetails(RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.TranslationSerializer
    queryset = models.Translation.objects.all()
    # permission_classes = (restmongo_permissions.IsAdminOrReadOnly,)


class LocalesList(ListCreateAPIView):
    serializer_class = serializers.LocalesSerializer
    queryset = models.Locales.objects.all()
    # permission_classes = (restmongo_permissions.IsAdminOrReadOnly,)


class LocalesDetails(RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.LocalesSerializer
    queryset = models.Locales.objects.all()
    # permission_classes = (restmongo_permissions.IsAdminOrReadOnly,)

"""

class CountryList(ListCreateAPIView):
    serializer_class = serializers.CountrySerializer
    queryset = models.Country.objects.all()
    # permission_classes = (restmongo_permissions.IsAdminOrReadOnly,)


class CountryDetails(RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.CountrySerializer
    queryset = models.Country.objects.all()
    # permission_classes = (restmongo_permissions.IsAdminOrReadOnly,)


class CityList(ListCreateAPIView):
    serializer_class = serializers.CitySerializer
    queryset = models.City.objects.all()
    # permission_classes = (restmongo_permissions.IsAdminOrReadOnly,)


class CityDetails(RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.CitySerializer
    queryset = models.City.objects.all()
    # permission_classes = (restmongo_permissions.IsAdminOrReadOnly,)


"""
#


class DjCity(viewsets.ModelViewSet):
    queryset = models.DjCity.objects.all()
    serializer_class = serializers.DjCity

    def perform_create(self, serializer):
        country_pk = self.request.data['country']
        country = models.DjCountry.objects.filter(pk=int(country_pk))
        if country:
            country = country[0]
        else:
            return
        location = self.request.data['location']
        serializer.save(country=country, location=location)

    def perform_update(self, serializer):
        location = self.request.data['location']
        name_locale = self.request.data['name_locale']
        if type(location) == type([]) and type(name_locale) == type({}):
            serializer.save(location=location, name_locale=name_locale)
        else:
            serializer.save()
#    permission_classes = (permissions.IsPAlbumCreatorOrReadOnly,)


class DjCountry(viewsets.ModelViewSet):
    queryset = models.DjCountry.objects.all()
    serializer_class = serializers.DjCountry

    def perform_update(self, serializer):
        name_locale = self.request.data['name_locale']
        if type(name_locale) == type({}):
            serializer.save(name_locale=name_locale)
        else:
            serializer.save()


class RegenerateCacheForCountryCity(APIView):

    def get(self, request, *args, **kwargs):
        if not request.user.is_admin:
            return Response({}, status=status.HTTP_401_UNAUTHORIZED)
        from django.core.management import call_command

        try:
            call_command('RegenerateCCList')
        except:
            return Response({'regenerate': False})
        return Response({'regenerate': True})
