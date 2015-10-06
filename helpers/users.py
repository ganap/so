from site_pref import models
from profiles import models as profiles_models
import send_email
from datetime import datetime
from django.conf import settings
import os
import shutil
import requests
from L18n import tr
from django.utils.timezone import utc

import random
import date
import other


def randomDigits(digits):
    lower = 10 ** (digits - 1)
    upper = 10 ** digits - 1
    return random.randint(lower, upper)


def RegisterUserAtTornado(pk, username, is_admin, is_moderator, is_expert):
    data = {
        "api_key": settings.TORNADO_API_KEY,
        "owner": pk,
        "username": username,
        "is_admin": is_admin,
        "is_moderator": is_moderator,
        "is_expert": is_expert
    }

    print(settings.TORNADO_CHAT_SERVER + "/api/v1/users/")
    r = requests.post(settings.TORNADO_CHAT_SERVER + "/api/v1/users/", data)
    user = eval(r.text)
    if "oid" in user.keys():
        return user['oid']
    return None


def CreateUser(username, email, unittest=False, password=None, is_admin=False, is_moderator=False, is_expert=False):
    if password == None:
        password = models.HermesUser.objects.make_random_password(length=8)
    context = {'username': username,
               'raw_password': password,
               'site': settings.SITE_URL + "/"
               }
    if not unittest:
        # try:
            mail = send_email.SendMailDB(email, context,
                                         'create_account')
            mail.send()
       # except:
        #    text = tr._TR("Can't send email to %s. Is it exists?")
         #   text = text % email
          #  return {'error': text}

    now = datetime.utcnow().replace(tzinfo=utc)

    user = profiles_models.MainUser.objects.create_user(username, email,
                                                        password,
                                                        )
    user.is_admin = is_admin
    user.is_moderator = is_moderator
    user.is_expert = is_expert
    # avatar stuff
    # search
    avatar_dir = settings.STATICFILES_DIRS[0] + "img/"
    avatar_default = os.path.join(avatar_dir, 'patient-medium.jpg')
    avatar_user = os.path.join(settings.MEDIA_ROOT,
                               'avatars', str(user.pk) + "-search.jpg")
    shutil.copy(avatar_default, avatar_user)
    # sidebar
    avatar_default = os.path.join(avatar_dir, 'patient-medium.jpg')
    avatar_user = os.path.join(settings.MEDIA_ROOT,
                               'avatars', str(user.pk) + "-sidebar.jpg")
    shutil.copy(avatar_default, avatar_user)
    # tiny
    avatar_default = os.path.join(avatar_dir, 'patient-small.jpg')
    avatar_user = os.path.join(settings.MEDIA_ROOT,
                               'avatars', str(user.pk) + "-tiny.jpg")
    shutil.copy(avatar_default, avatar_user)

    # Tornado: Chat
    # try:
    chat_user_oid = RegisterUserAtTornado(user.pk,
                                          user.username,
                                          is_admin,
                                          is_moderator,
                                          is_expert)
    user.socket_user_oid = str(chat_user_oid)
    # except:
        # pass
    user.save()

    return user
