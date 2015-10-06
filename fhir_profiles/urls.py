from django.conf.urls import patterns, url, include
from django.views.generic import RedirectView
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = patterns('',
                       url(r'^api/v1/fhir-profiles/',
                           include('fhir_profiles.rest.urls')),


                       )
