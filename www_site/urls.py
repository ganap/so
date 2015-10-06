from django.conf.urls import patterns, include, url
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = patterns('',
                       # Examples:
                       # url(r'^$', 'hermes.views.home', name='home'),
                       url(r'', include('profiles.urls')),
                       url(r'', include('site_pref.urls')),
                       # url(r'', include('mongo_app.urls')),
                       url(r'', include('L18n.urls')),
                       url(r'', include('fhir_profiles.urls')),
                       url(r'', include('gcloud.urls')),
                       url(r'', include('so.urls')),
                       url(r'', include('payment.urls')),
                       )
urlpatterns = urlpatterns + static(settings.STATIC_URL,
                                   document_root=settings.STATIC_ROOT)

urlpatterns = urlpatterns + static(settings.MEDIA_URL,
                                   document_root=settings.MEDIA_ROOT)
