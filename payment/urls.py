from django.conf.urls import patterns, url, include
from rest_framework.urlpatterns import format_suffix_patterns
from django.views.generic import RedirectView
from django.views.decorators.csrf import csrf_exempt
from payment import views
urlpatterns = patterns('',
                       url(r'^paypal/on-return/$', csrf_exempt(
                           RedirectView.as_view(
                               url='/s/#/patient/so')
                           ),
                           name="paypal-on-return"),

                       url(r'^paypal/on-cancel/$', csrf_exempt(
                           RedirectView.as_view(
                               url='/s/#/patient/so')
                           ),
                           name="paypal-on-cancel"),


                       url(r'^api/v1/paypal/button/$',
                           views.RenderPaypalButton.as_view()),


                       url(r'^api/v1/paypal/users/(?P<pk>\d+)/tr-id-count/$',
                           views.UserPaypal.as_view()),




                       url(r'^paypal/communicate/$', include(
                           'paypal.standard.ipn.urls')),

                       )

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'api'])
