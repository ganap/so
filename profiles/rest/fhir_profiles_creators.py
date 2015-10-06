
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_mongoengine.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView

from profiles import models, serializers as profile_serializers
from L18n import tr
import helpers


from basic_documents import creator
from basic_documents.info import FhirDoc
from fhir_profiles import users as fhir_users
from fhir_profiles import serializers
from permissions import permissions
import requests
from gcloud import google_cloud
import shutil


def saveDicomFromImagingStudy(reference, user_pk):
    r = requests.get("https://fhir-open-api.smarthealthit.org/" + reference,
                     stream=True)
    filename = helpers.id_generator(13)
    with open("/tmp/" + filename + ".dcm", 'wb') as f:
        r.raw.decode_content = True
        shutil.copyfileobj(r.raw, f)
    f = open("/tmp/" + filename + ".dcm")
    path = google_cloud.upload_to_gc(f)
    return path


class CreatePatient(APIView):

    def post(self, request, *args, **kwargs):
        data = dict(request.data)
        if not request.user.is_authenticated():
            return Response({}, status.HTTP_401_UNAUTHORIZED)

        fhir_users.Patient.objects(owner=request.user.pk).delete()

        humanName = creator.HumanName(data['name'])
        #
        #
        data_contacts = data['telecom']
        contacts = []
        for dc in data_contacts:
            if not dc['value']:
                continue

            contacts.append(
                creator.ContactPoint(dc)
            )
        #
        #
        data_address = data['address']
        address = creator.Address(data_address)
        #
        #
        patient = fhir_users.Patient(
            name=[humanName],
            telecom=contacts,
            gender=data['gender'],
            birthDate=creator.getDateTimeOrNone(data['birthDate']),
            maritalStatus=data['maritalStatus'],
            address=[address],
            owner=request.user.pk
        )

        patient.save()
        request.user.patient = str(patient.pk)
        request.user.is_organization = False
        request.user.organization = ''
        request.user.save()
        data = serializers.PatientSerializer(patient)
        return Response(data.data)

    def put(self, request, *args, **kwargs):
        data = dict(request.data)

        name_list = []
        data = data['patient']
        for name in data['name']:
            name = creator.HumanName(name)
            if name:
                name_list.append(name)

        #
        #
        data_contacts = data['telecom']
        contacts = []
        for dc in data_contacts:
            if not dc['value']:
                continue

            contacts.append(
                creator.ContactPoint(dc)
            )
        #
        #
        address_list = []
        for address in data['address']:
            address = creator.Address(address)
            if address:
                address_list.append(address)
        #
        #
        patient = fhir_users.Patient.objects.get(pk=request.user.patient)
        patient.name = name_list
        patient.telecom = contacts
        patient.gender = data['gender']
        patient.birthDate = creator.getDateTimeOrNone(data['birthDate'])
        patient.maritalStatus = data['maritalStatus']
        patient.address = address_list

        patient.save()
        # updating fhir doc
        user = models.MainUser.objects.get(pk=patient.owner)
        fhir_doc = FhirDoc.objects.get(pk=user.fhir_doc)
        data = self.request.data['fhir_doc']
        for f in data.keys():
            setattr(fhir_doc, f, data[f])
        fhir_doc.save()
        data = serializers.PatientSerializer(patient)
        return Response(data.data)


class PatientsByCoordinator(APIView):

    def get(self, request, *args, **kwargs):
        is_moderator = getattr(request.user, 'is_moderator', False)
        if not is_moderator:
            return Response({}, status.HTTP_403_FORBIDDEN)
        users = models.MainUser.objects.filter(is_admin=False,
                                               is_moderator=False,
                                               is_expert=False)
        data = profile_serializers.MainUserSerializer(users, many=True)
        return Response(data.data)

    def post(self, request, *args, **kwargs):
        is_moderator = getattr(request.user, 'is_moderator', False)
        if not is_moderator:
            return Response({}, status.HTTP_403_FORBIDDEN)
        data = dict(request.data)
        send_email = not data['send_email']

        user = helpers.users.CreateUser(data['username'],
                                        data['email'],
                                        send_email,
                                        data['password'],
                                        )
        fhir_users.Patient.objects(owner=user.pk).delete()

        data = data['patient']
        names = creator.ListObj(data.get('name', []),
                                creator.HumanName)
        #
        contacts = creator.ListObj(data.get('telecom', []),
                                   creator.ContactPoint)
        #
        addresses = creator.ListObj(data.get('address', []),
                                    creator.Address)
        #
        birthDate = data.get('birthDate', '')
        birthDate = creator.getDateTimeOrNone(birthDate)
        fhir_doc_data = request.data.get('fhir_doc', None)
        if fhir_doc_data:
            if 'ImagingStudy' in fhir_doc_data.keys():
                ImagingStudy = fhir_doc_data['ImagingStudy']['entry']
                i = 0
                while i < len(ImagingStudy):
                    study = ImagingStudy[i]
                    j = 0
                    while j < len(study['content']['series']):
                        series = study['content']['series'][j]
                        m = 0
                        while m < len(series['instance']):
                            instance = series['instance'][m]
                            url = saveDicomFromImagingStudy(
                                instance['attachment']['reference'], user.pk)
                            instance['attachment']['gcloud_path'] = {
                                'bucket': settings.GS_STORAGE_BUCKET,
                                'path': url[0]
                            }
                            instance['attachment']['ext'] = url[1]
                            ImagingStudy[i]['content']['series'][
                                j]['instance'][m] = instance
                            m += 1
                        j += 1
                    i += 1

            fhir_doc = FhirDoc(**fhir_doc_data)
            fhir_doc.save()
            fhir_doc_pk = str(fhir_doc.pk)
        else:
            fhir_doc_pk = ''
        # try:
        patient = fhir_users.Patient(
            name=names,
            telecom=contacts,
            gender=data.get('gender', 'U'),
            birthDate=birthDate,
            maritalStatus=data.get('maritalStatus', 'U'),
            address=addresses,
            owner=user.pk,

        )
            # except:
            # user.delete()
            # return Response({'error': 'Cant create profile'},
             #               status.HTTP_500_INTERNAL_SERVER_ERROR)
        patient.save()
        user.patient = str(patient.pk)
        user.is_organization = False
        user.organization = ''
        user.created_by = request.user.pk
        user.pk_can_edit.append(request.user.pk)
        user.fhir_doc = fhir_doc_pk
        user.save()
        data = serializers.PatientSerializer(patient)
        return Response(data.data)


class PatientsByCoordinatorDetails(RetrieveUpdateAPIView):
    serializer_class = profile_serializers.MainUserSerializer
    queryset = models.MainUser
   # permission_classes = (permissions.IsCanEditOrNone,)

    def perform_update(self, serializer):
        serializer.save()
        instance = self.get_object()
        patient = fhir_users.Patient.objects.get(pk=instance.patient)
        data = self.request.data['patient']
        names = creator.ListObj(data.get('name', []),
                                creator.HumanName)
        #
        contacts = creator.ListObj(data.get('telecom', []),
                                   creator.ContactPoint)
        #
        addresses = creator.ListObj(data.get('address', []),
                                    creator.Address)

        for field in self.request.data['patient'].keys():
            value = self.request.data['patient'][field]
            if field == 'name':
                setattr(patient, field, names)
            elif field == 'telecom':
                setattr(patient, field, contacts)
            elif field == 'address':
                setattr(patient, field, addresses)
            else:
                setattr(patient, field, value)
        patient.save()
        # updating fhir doc
        user = models.MainUser.objects.get(pk=patient.owner)
        fhir_doc = FhirDoc.objects.get(pk=user.fhir_doc)
        data = self.request.data['fhir_doc']
        for f in data.keys():
            setattr(fhir_doc, f, data[f])
        fhir_doc.save()
