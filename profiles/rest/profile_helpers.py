
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


from profiles import models, serializers
from L18n import tr
import helpers


class ResetPassword(APIView):

    def post(self, request, *args, **kwargs):
        data = dict(request.data)
        url = models.MainUser.objects.make_random_password(length=20)
        user = models.MainUser.objects.filter(email=data['email'])
        if not user:
            return Response({})
        models.ResetPasswordUrl.objects.create(url=url,
                                               user_pk=user[0].pk)
        context = {'reset_url': url,
                   'user': user[0]}
        mail = helpers.send_email.SendMailDB(data['email'], context,
                                             'reset_password')
        mail.send()
        return Response({'sended': True})

    def put(self, request, *args, **kwargs):
        data = dict(request.data)
        url = data['url']
        reset = models.ResetPasswordUrl.objects.filter(url=url)
        if not reset:
            return Response({'error': tr._TR("This url already used for password reset!")})
        reset = reset[0]
        user = models.MainUser.objects.filter(pk=reset.user_pk)
        if not user:
            return Response({'error': tr._TR("Can't find this user!")})
        user = user[0]
        user.set_password(data['password1'])
        user.save()
        reset.delete()
        return Response({})


class Profile(APIView):

    def get(self, request, *args, **kwargs):
        data = serializers.MainUserSerializer(request.user)
        return Response(data.data)


class IsEmailInDb(APIView):

    """
    Check is email in db for regitstration page
    .../email=x
    return true/false
    """

    def get(self, request, *args, **kwargs):
        email = kwargs.get('email', "None")
        users = models.MainUser.objects.filter(email=email)
        if users:
            return Response({"email": True})
        else:
            return Response({"email": False})


class GetTornadoApiKey(APIView):

    def get(self, request, *args, **kwargs):
        if request.user.is_admin:
            return Response({'api_key': settings.TORNADO_API_KEY,
                             'server': settings.TORNADO_CHAT_SERVER
                             })
        return Response({'error': 'Not admin'})


class IsUsernameInDb(APIView):

    """
    Check is username in db for regitstration page
    .../username=x
    return true/false
    """

    def get(self, request, *args, **kwargs):
        username = kwargs.get('username', "None")
        users = models.MainUser.objects.filter(username=username)
        if users:
            return Response({"username": True})
        else:
            return Response({"username": False})
