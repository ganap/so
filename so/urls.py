from django.conf.urls import patterns, url
from django.views.generic import RedirectView
from rest_framework.urlpatterns import format_suffix_patterns
from so import rest

urlpatterns = patterns('',

                       url(r'^api/v1/so/$',
                           rest.SODiagnosis.as_view()),
                       url(r'^api/v1/so/(?P<id>[\w]{24})/$',
                           rest.SODiagnosisDetails.as_view(
                           )),
                       url(r'^api/v1/so/own/$',
                           rest.SODiagnosisOwn.as_view(
                           )),


                       )
