from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from profiles import models, serializers
from rest_framework_mongoengine.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from permissions import permissions
from helpers import users


class CoordinatorList(APIView):

    def get(self, request, *args, **kwargs):
        coordinators = models.MainUser.objects.filter(
            is_moderator=True
        )
        data = serializers.MainUserSerializer(coordinators, many=True)
        return Response(data.data)

    def post(self, request, *args, **kwargs):
        is_admin = getattr(request.user, 'is_admin', None)
        if not is_admin:
            return Response({}, status.HTTP_403_FORBIDDEN)
        data = dict(request.data)
        send_mail = not data['send_email']
        coordinator = users.CreateUser(data['username'],
                                       data['email'],
                                       password=data['password'],
                                       unittest=send_mail)
        coordinator.is_moderator = True
        coordinator.save()
        data = serializers.MainUserSerializer(coordinator)
        return Response(data.data, status.HTTP_201_CREATED)


class CoordinatorDetails(RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.MainUserSerializer
    queryset = models.MainUser
    permission_classes = (permissions.IsAdminOrReadOnly,)
