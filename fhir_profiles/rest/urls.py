from django.conf.urls import patterns, url
from django.views.generic import RedirectView
from rest_framework.urlpatterns import format_suffix_patterns
import view_search
import related_person
import attachments

urlpatterns = patterns('',
                       url(r'^patients/$',
                           view_search.PatientList.as_view()),
                       url(r'^related-persons/$',
                           related_person.RelatedPersonList.as_view()),
                       url(r'^related-persons/(?P<id>[\w]{24})/$',
                           related_person.RelatedPersonDetails.as_view(
                           )),
                       url(r'^related-persons/owner/(?P<owner>\d+)/$',
                           related_person.RelatedPersonList.as_view()),
                       url(r'^attachments/$',
                           attachments.MyAttachments.as_view(
                           )),
                       url(r'^attachments/by-owner/(?P<user_pk>\d+)/$',
                           attachments.AttachmentsByOwner.as_view(
                           )),

                       url(r'^attachments/(?P<id>[\w]{24})/$',
                           attachments.AttachmentsDetails.as_view(
                           )),




                       )
