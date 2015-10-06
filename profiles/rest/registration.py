
from django.contrib.auth import logout
from django.contrib.auth import authenticate, login
import os
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


from profiles import models
from L18n import tr
import helpers


class Registration(APIView):

    def post(self, request, *args, **kwargs):
        """
            Creates new user
        """
        data = dict(request.data)
        username = data['username']
        users = models.MainUser.objects.filter(username=username)
        if users:
            return Response({'error': "Username already in db!"},
                            status=status.HTTP_400_BAD_REQUEST)
        email = data['email']
        users = models.MainUser.objects.filter(email=email)
        if users:
            return Response({'error': "Email already in db!"},
                            status=status.HTTP_400_BAD_REQUEST)
            # try:
        password = data['password']
        error = helpers.users.CreateUser(username,
                                         email,
                                         password=password)
            # except:
            # models.MainUser.objects.filter(username=username,
               #                            email=email).delete()
            # return Response({'error': tr._TR('Failed to create user with
            # given credentials. Try again later.')})
        if type(error) == type({}):
            return Response(error)
        return Response({},
                        status=status.HTTP_201_CREATED,
                        )

    def put(self, request, *args, **kwargs):
        """
            Login
        """
        data = dict(request.data)
        username = data.get("username", None)
        password = data.get('password', None)
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'ok': user.pk})
        else:
            return Response({'error': tr._TR('Wrong username or password!')},
                            status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """
            Logout
        """
        if not request.user.is_authenticated():
            return Response({'ok': 0})
        logout(request)
        return Response({'ok': 0})
