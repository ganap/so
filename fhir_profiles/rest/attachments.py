
import os
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from basic_documents import info, serializers
from rest_framework_mongoengine.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from gcloud import google_cloud
from profiles import models
from permissions import permissions


class MyAttachments(APIView):

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return Response({}, status.HTTP_401_UNAUTHORIZED)
        attachments = info.Attachment.objects(owner=request.user.pk)
        data = serializers.AttachmentSerializer(attachments, many=True)
        return Response(data.data)


class AttachmentsByOwner(APIView):

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return Response({}, status.HTTP_401_UNAUTHORIZED)
        user_pk = int(kwargs.get('user_pk'))
        user = models.MainUser.objects.get(pk=user_pk)
        edit = user.pk_can_view
        pk = request.user.pk
        # 1 / 0
        if request.user.pk != user_pk:
            if request.user.pk not in user.pk_can_edit and \
                    request.user.pk not in user.pk_can_view:
                if not request.user.is_admin:
                    return Response({}, status.HTTP_401_UNAUTHORIZED)
        attachments = info.Attachment.objects(owner=user_pk)
        data = serializers.AttachmentSerializer(attachments, many=True)
        return Response(data.data)


class AttachmentsDetails(RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.AttachmentSerializer
    queryset = info.Attachment.objects.all()
    permission_classes = (permissions.IsCanEditObjectsOrNone,)

    def perform_destroy(self, instance):
        try:
            google_cloud.delete_from_gc(instance.gcloud_path['path'])
            if instance.ext == '.jpg':
                google_cloud.delete_from_gc(
                    instance.gcloud_path['path'] + ".thumbnail.jpg")
        except:
            pass
        instance.delete()
