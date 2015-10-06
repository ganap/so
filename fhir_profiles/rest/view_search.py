from rest_framework_mongoengine.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
import os
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from fhir_profiles import serializers
from fhir_profiles import users as models


class PatientList(ListCreateAPIView):
    serializer_class = serializers.PatientSerializer
    queryset = models.Patient.objects.all()
    # permission_classes = (restmongo_permissions.IsAdminOrModeratorOrNone,)

    def post(self, *args, **kwargs):
        return Response(None, status.HTTP_403_FORBIDDEN)


class PatientDetails(RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.PatientSerializer
    queryset = models.Patient.objects.all()
    # permission_classes = (restmongo_permissions.IsAdminOrModeratorOrNone,)
