
import os
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_mongoengine.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView

from fhir_profiles import users, serializers
from basic_documents import creator


class RelatedPersonList(ListCreateAPIView):
    serializer_class = serializers.RelatedPersonSerializer
    queryset = users.RelatedPerson.objects.all()
    # permission_classes = (restmongo_permissions.IsAdminOrModeratorOrNone,)

    def get(self, request, *args, **kwargs):
        owner = kwargs.get('owner', None)
        if not owner:
            return Response([], status.HTTP_204_NO_CONTENT)
        rpersons_list = users.RelatedPerson.objects(owner=int(owner))
        data = serializers.RelatedPersonSerializer(rpersons_list, many=True)
        return Response(data.data)

    def post(self, request, *args, **kwargs):
        data = dict(request.data)
        name = creator.HumanName(data['name'])
        telecom_list = []
        for t in data['telecom']:
            t = creator.ContactPoint(t)
            telecom_list.append(t)

        address = creator.Address(data.get('address', None))
        period = creator.Period(data.get('period', None))

        rperson = users.RelatedPerson(
            owner=request.user.pk,
            relationship=data['relationship'],
            name=name,
            telecom=telecom_list,
            address=address,
            gender=data['gender'],
            period=period
        )
        rperson.save()
        data = serializers.RelatedPersonSerializer(rperson)
        return Response(data.data)


class RelatedPersonDetails(RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.RelatedPersonSerializer
    queryset = users.RelatedPerson.objects.all()
    # permission_classes = (restmongo_permissions.IsAdminOrModeratorOrNone,)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        data = dict(request.data)
        instance = self.get_object()
        name = creator.HumanName(data['name'])
        telecom_list = []
        for t in data['telecom']:
            t = creator.ContactPoint(t)
            if t:
                telecom_list.append(t)
        address = creator.Address(data.get('address', None))
        period = creator.Period(data.get('period', None))

        instance.relationship = data['relationship']
        instance.name = name
        instance.telecom = telecom_list
        instance.address = address
        instance.period = period
        instance.gender = data['gender']

        instance.save()
        data = serializers.RelatedPersonSerializer(instance)

        return Response(data.data)
