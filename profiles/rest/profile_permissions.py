
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_mongoengine.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView

from profiles import models, serializers as profile_serializers
from L18n import tr
import helpers


class PatientPermission(APIView):

    def put(self, request, *args, **kwargs):
        data = dict(request.data)
        # if data['api_key'] != settings.TORNADO_API_KEY:
         #   return Response({}, status.HTTP_401_UNAUTHORIZED)
        pk = kwargs.get("id")
        user = models.MainUser.objects.get(pk=pk)
        if data['action'] == 'remove':
            user_pk = data['user']
            if type(user_pk) != type(0):
                user_pk = int(user_pk[0])
            user.pk_can_view.remove(user_pk)
        else:
            user_pk = data['user']
            if type(user_pk) != type(0):
                user_pk = int(user_pk[0])
            user.pk_can_view.append(user_pk)
        user.save()
        return Response({})
