
import os
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import helpers
from fhir_profiles import users
from profiles import models


class ProfilePhoto(APIView):

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return Response({}, status.HTTP_401_UNAUTHORIZED)
        data = dict(request.data)
        photo = data['photo'][0]
        name = photo.name
        ext = os.path.splitext(name)[-1]
        user_pk = data.get('user_pk', [0])
        user_pk = int(user_pk[0])
        if not user_pk:
            user_pk = request.user.pk
            user = request.user
        else:
            user = models.MainUser.objects.get(pk=user_pk)
            if request.user.pk != user_pk:
                if request.user.pk not in user.pk_can_edit:
                    if not request.user.is_admin:
                        return Response({}, status.HTTP_403_FORBIDDEN)

        filepath = "profile_photos/" + \
            helpers.id_generator() + str(helpers.timestamp_sec() / 100) + ext

        helpers.fs.save_file(filepath, photo)
        helpers.fs.generate_single_avatar(filepath, user.pk)
        if not user.is_organization and not user.is_expert:
            patient = users.Patient.objects.get(pk=user.patient)
            patient.photo = [filepath]
            patient.save()
        elif user.is_expert:
            expert = users.Expert.objects.get(pk=user.expert)
            expert.photo = [filepath]
            expert.save()

        return Response({'path': filepath})
