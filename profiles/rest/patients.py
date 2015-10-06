from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from profiles import models, serializers
from rest_framework_mongoengine.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from permissions import permissions
from helpers import users
from fhir_profiles import users as fhir_users, serializers as fhir_serializers
from basic_documents import creator


class PatientsList(APIView):

    def get(self, request, *args, **kwargs):
        patients = models.MainUser.objects.filter(
            is_expert=False,
            is_moderator=False,
            is_admin=False
        )
        data = serializers.MainUserSerializer(patients, many=True)
        return Response(data.data)

    def post(self, request, *args, **kwargs):
        is_admin = getattr(request.user, 'is_admin', None)
        is_moderator = getattr(request.user, 'is_moderator', None)
        if not is_admin or not is_moderator:
            return Response({}, status.HTTP_403_FORBIDDEN)
        data = dict(request.data)
        send_mail = not data['send_email']
        patient = users.CreateUser(data['username'],
                                   data['email'],
                                   password=data['password'],
                                   unittest=send_mail)

        patient_mongo = fhir_users.Patient(
            owner=patient.pk,
            name=creator.HumanName(data['patient']['name']),
            degree=data['patient']['degree'],
            speciality=data['patient']['speciality'],
            clinical_patientise=data['patient']['clinical_patientise'],
            link_to_drupal=data['patient']['link_to_drupal']
        )
        patient_mongo.save()
        patient.is_patient = True
        patient.patient = str(patient_mongo.pk)
        patient.save()
        data = serializers.MainUserSerializer(patient)
        return Response(data.data, status.HTTP_201_CREATED)


class PatientDetails(RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.MainUserSerializer
    queryset = models.MainUser
    permission_classes = (permissions.IsAdminOrReadOnly,)
