
import os
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from gcloud import google_cloud
from basic_documents import info, serializers
import helpers


class Attachment(APIView):

    def post(self, request, *args, **kwargs):
        data = dict(request.data)
        if not request.user.is_authenticated():
            return Response({}, status.HTTP_401_UNAUTHORIZED)
        file_ = data['file'][0]
        user_pk = data.get('user_pk', [request.user.pk])
        user_pk = int(user_pk[0])
        if not user_pk:
            user_pk = request.user.pk
        path = google_cloud.upload_to_gc(file_)
        try:
            creation = data['date'][0]
            creation = helpers.date.timestamp_to_datetime(creation)
        except:
            creation = helpers.date.timestamp()

        title = os.path.splitext(file_.name)[0]
        attachment = info.Attachment(
            owner=user_pk,
            gcloud_path={
                'bucket': settings.GS_STORAGE_BUCKET,
                'path': path[0]
            },
            ext=path[1],
            title=title,
            creation=creation,
            timestamp=helpers.date.timestamp()
        )
        attachment.save()
        data = serializers.AttachmentSerializer(attachment)
        return Response(data.data)
