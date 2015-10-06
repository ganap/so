from django.conf.urls import patterns, url
from django.views.generic import RedirectView
from rest_framework.urlpatterns import format_suffix_patterns
import attachments

urlpatterns = patterns('',
                       url(r'^attachments/$',
                           attachments.Attachment.as_view()),


                       )
