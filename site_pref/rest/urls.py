from django.conf.urls import patterns, url
from django.views.generic import RedirectView
from rest_framework.urlpatterns import format_suffix_patterns
import model_types_helpers
import sitepref

urlpatterns = patterns('',
                       url(r'^model-types/$',
                           model_types_helpers.ModelTypes.as_view()),
                       url(r'^mongo/$',
                           model_types_helpers.RunMongo.as_view()),
                       url(r'^$',
                           sitepref.SitePref().as_view()),
                       url(r'^download/(?P<url>.+)$',
                           sitepref.Download().as_view()),


                       )
