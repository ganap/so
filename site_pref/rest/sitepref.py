
import os
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from site_pref import models, serializers
import requests


class SitePref(APIView):

    def get(self, request, *args, **kwargs):
        sp = models.SitePreferences.objects.get(pk=1)
        data = serializers.SitePreferencesSerializer(sp)
        return Response(data.data)

    def put(self, request, *args, **kwargs):
        is_admin = getattr(request.user, 'is_admin', False)
        if not is_admin:
            return Response({}, status.HTTP_403_FORBIDDEN)
        data = dict(request.data)
        sp = models.SitePreferences.objects.get(pk=1)
        ser = serializers.SitePreferencesSerializer(data=data)
        ser.is_valid()
        ser.update(sp, ser.validated_data)
        return Response(data)


class Download(APIView):

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return Response({}, status.HTTP_401_UNAUTHORIZED)

        headers = {'accept': 'application/json'}
        g = dict(request.GET)
        url = kwargs.get('url')
        query_url = ''
        for key in g.keys():
            query_url += key
            query_url = query_url + '=' + g[key][0]
        if len(query_url):
            url = url + "?" + query_url

        if "https:/" in url and "https://" not in url:
                url = url.replace("https:/", 'https://')
        elif "http:/" in url and "http://" not in url:
                url = url.replace("http:/", 'http://')
        elif "http://" not in url:
            url = "http://" + url
        r = requests.get(url, headers=headers)
        return Response(r.json())
