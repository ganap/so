from django.conf.urls import patterns, url, include
from rest_framework.urlpatterns import format_suffix_patterns
from django.views.generic import RedirectView

urlpatterns = patterns('',

                       # rest api
                       url(r'^api/v1/site-pref/', include(
                           'site_pref.rest.urls')),
                       )

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'api'])
