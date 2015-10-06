from django.conf.urls import patterns, url
from django.views.generic import RedirectView
from rest_framework.urlpatterns import format_suffix_patterns

from profiles.rest import registration
from profiles.rest import profile_helpers
from profiles.rest import photo
from profiles.rest import fhir_profiles_creators
from profiles.rest import measurements
from profiles.rest import coordinators
from profiles.rest import experts
from profiles.rest import patients
from profiles.rest import profile_permissions

urlpatterns = patterns('',
                       # registration
                       url(r'^registration/$',
                           registration.Registration.as_view()),

                       # helpers
                       url(r'^registration/email-is-in-db/(?P<email>[^/]+)/$',
                           profile_helpers.IsEmailInDb.as_view()),

                       url(r'^registration/username-is-in-db/(?P<username>[^/]+)/$',
                           profile_helpers.IsUsernameInDb.as_view()),

                       url(r'^registration/reset-password/$',
                           profile_helpers.ResetPassword().as_view()),

                       # own profile
                       url(r'^own-profile/$',
                           profile_helpers.Profile().as_view()),
                       url(r'^own-profile/patient/$',
                           fhir_profiles_creators.CreatePatient.as_view(
                           )),
                       url(r'^own-profile/photos/$',
                           photo.ProfilePhoto().as_view()),
                       url(r'^own-profile/measurements/$',
                           measurements.Measurements().as_view()),

                       url(r'^own-profile/measurements/everyday-list/$',
                           measurements.DailyMeasurements().as_view()),

                       # experts

                       url(r'^experts/$',
                           experts.ExpertsList().as_view()
                           ),
                       url(r'^experts/(?P<id>\d+)/$',
                           experts.ExpertDetails().as_view()),




                       # coordinators

                       url(r'^coordinators/$',
                           coordinators.CoordinatorList().as_view()
                           ),
                       url(r'^coordinators/(?P<id>\d+)/$',
                           coordinators.CoordinatorDetails().as_view()),


                       # experts

                       url(r'^experts/$',
                           experts.ExpertsList().as_view()
                           ),
                       url(r'^experts/(?P<id>\d+)/$',
                           experts.ExpertDetails().as_view()),
                       url(r'^experts/photos/$',
                           photo.ProfilePhoto.as_view(
                           )),


                       # patients

                       url(r'^patients/$',
                           patients.PatientsList().as_view()
                           ),
                       url(r'^patients/(?P<id>\d+)/$',
                           patients.PatientDetails.as_view()),
                       url(r'^patients/(?P<id>\d+)/permissions/$',
                           profile_permissions.PatientPermission.as_view()),



                       # patients created by coordinators

                       url(r'^patients-by-coordinator/$',
                           fhir_profiles_creators.PatientsByCoordinator(
                           ).as_view()
                           ),
                       url(r'^patients-by-coordinator/(?P<id>\d+)/$',
                           fhir_profiles_creators.PatientsByCoordinatorDetails.as_view(
                           )),
                       url(r'^patients-by-coordinator/photos/$',
                           photo.ProfilePhoto.as_view(
                           )),








                       )
