import mongoengine
from django.conf import settings


def MongoDbConnect():
    mongoengine.connect('db_2')
    return
    if settings.SERVER == 'localhost':
        mongoengine.connect('db_2')
    else:
        mongoengine.connect(host=settings.MONGODB_URL)
