"""
Django settings for hermes project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'oka485%0c1fog11e=ucco367-cp#n@#0scw3r13#fj4)_pq4b1'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    #'registration',
    'rest_framework',
    #'multiselectfield',
    'paypal.standard.ipn',
    'rest_framework_mongoengine',
    'restmongo',
    'site_pref',
    'profiles',
    'fhir_profiles',
    'helpers',
    'permissions',
    'payment',
    'so',
    #    'mongo_app',
    'L18n',
)
AUTH_USER_MODEL = 'profiles.MainUser'
MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'www_site.urls'

WSGI_APPLICATION = 'www_site.wsgi.application'

TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, "profiles", "templates"),
)

# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        # 'django.contrib.gis.db.backends.spatialite',  # 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    },
}

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = ""
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static/"),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)


MEDIA_ROOT = os.path.join(BASE_DIR, "media_files/")
# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = "/media_files/"

# registration
ACCOUNT_ACTIVATION_DAYS = 5
AUTH_USER_EMAIL_UNIQUE = True
EMAIL_HOST = 'localhost'
EMAIL_PORT = 1025
SITE_ID = 1

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

SESSION_SERIALIZER = 'django.contrib.sessions.serializers.PickleSerializer'


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
"""
EMAIL_HOST = 'smtp.yandex.ru'
EMAIL_HOST_USER = 'project.hermes@yandex.ru'
DEFAULT_FROM_EMAIL = 'project.hermes@yandex.ru'
EMAIL_HOST_PASSWORD = '1990project'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
"""
EMAIL_HOST = 'smtp.mail.ru'
EMAIL_HOST_USER = 'hermes.project@mail.ru'
DEFAULT_FROM_EMAIL = 'hermes.project@mail.ru'
EMAIL_HOST_PASSWORD = '1990msf'
EMAIL_PORT = 2525
EMAIL_USE_TLS = True

SERVER = os.environ.get('SERVER', None)


REST_FRAMEWORK = {
    'TEST_REQUEST_DEFAULT_FORMAT': 'json'
}


if SERVER == 'localhost':
    TORNADO_CHAT_SERVER = "http://localhost:8888"
    TORNADO_WS_SERVER = "localhost:8888"
    THIS_SERVER = "http://127.0.0.1:8000"
else:
    TORNADO_WS_SERVER = "104.155.31.77"
    # TORNADO_WS_SERVER = "146.148.116.83"
    TORNADO_CHAT_SERVER = "http://" + TORNADO_WS_SERVER
    THIS_SERVER = "http://146.148.127.101"
    # THIS_SERVER = "http://104.155.42.116"
TORNADO_API_KEY = "5576fac672baa94327b8dbe3-5576fac672baa94327b8dbe2"
SITE_URL = THIS_SERVER


MONGODB_URL = "mongodb://kirill:msf1990@ds055680.mongolab.com:55680/db_1"


"""
        PayPal
"""
PAYPAL_RECEIVER_EMAIL = 'pavlo.bash-facilitator@gmail.com'


# Google Cloud Storage
GS_CLIENT_ID = '43698146520-s65ompffkq16othltdctb7ga85lukuil.apps.googleusercontent.com'
GS_CLIENT_SECRET = 'qkVCacLmWvko_pP0pKqXkZlo'
GS_STORAGE_BUCKET = 'so_medical'
GS_URI_SCHEME = 'gs'

#
