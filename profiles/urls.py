from django.conf.urls import patterns, url, include
from rest_framework.urlpatterns import format_suffix_patterns
from django.views.generic import RedirectView
from profiles import views
from django.views.decorators.csrf import csrf_exempt
urlpatterns = patterns('',
                       url(r'^login/$', views.LoginPage.as_view(),
                           name="index"),
                       url(r'^register/$', views.RegisterPage.as_view(),
                           name="index"),
                       url(r'^logout/$', views.Logout.as_view(),
                           name="index"),
                       url(r'^library/$', views.LibraryPage.as_view(),
                           name="index"),
                       url(r'^about.html$', views.AboutPage.as_view(),
                           name="index"),
                       url(r'^$', RedirectView.as_view(url="/home.html"),
                           name="index"),
                       url(r'^library.html/$', RedirectView.as_view(url="/library"),
                           name="index"),
                       url(r'^team.html$', views.TeamPage.as_view(),
                           name="index"),
                       url(r'^contact.html$', views.ContactPage.as_view(),
                           name="index"),
                       url(r'^Contact/$', RedirectView.as_view(url="/contact.html"),
                           name="index"),
                       url(r'^about-so/$', views.AboutSoUnregisteredPage.as_view(),
                           name="index"),



                       url(r'^home.html$', views.HomePage.as_view(),
                           name="index"),
                       url(r'^s/$', views.MainPageAuthenticatedUsed.as_view(),
                           name="index"),

                       url(r'^ro/$', views.MainPageRunOnce.as_view(),
                           name="index"),

                       url(r'^a/$', views.AdminPage.as_view(),
                           name="admin"),

                       url(r'^m/$', views.ModeratorPage.as_view(),
                           name="moderator"),

                       url(r'^e/$', views.ExpertPage.as_view(),
                           name="expert"),

                       url(r'^reset-password/(?P<reset_url>[^/]+)/$',
                           views.ResetPassword.as_view(),
                           name="reset-password"),

                       url(r'^sh/$', views.ShutdownPage.as_view(),
                           name="shutdown"),


                       # url(r'^paypal/button/$', views.RenderPaypalButtonPremiumPromoCode.as_view(),
                       #   name="paypal-button"),

                       # url(r'^paypal/on-return/$', csrf_exempt(
                       # RedirectView.as_view(url='/s/#/promocode')
                       #   ),
                       #   name="paypal-on-return"),

                       # url(r'^paypal/on-cancel/$', csrf_exempt(
                       # RedirectView.as_view(url='/s/#/promocode')
                       #   ),
                       #   name="paypal-on-cancel"),


                       url(r'^video-call/room=(?P<room>[^/]+)/(?P<username1>[^/]+)/(?P<username2>[^/]+)/$', views.WebRTCOne2One.as_view(),
                           name="shutdown"),



                       url(r'^paypal/communicate/$', include(
                           'paypal.standard.ipn.urls')),

                       # rest api
                       url(r'^api/v1/', include('profiles.rest.urls')),
                       )

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'api'])
