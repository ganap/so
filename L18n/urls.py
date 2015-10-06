from django.conf.urls import patterns, url, include
from rest_framework.urlpatterns import format_suffix_patterns
urlpatterns = patterns('',

                       # rest api
                       url(r'^api/L18n1/', include('L18n.rest.urls')),
                       )

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'api'])
