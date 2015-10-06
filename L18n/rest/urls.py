from django.conf.urls import patterns, include, url
import rest
from rest_framework import routers

router_djcity = routers.SimpleRouter()
router_djcity.register(r'city', rest.DjCity)

router_djcountry = routers.SimpleRouter()
router_djcountry.register(r'countries', rest.DjCountry)


urlpatterns = patterns('',

                       url(r'^locales/$',
                           rest.LocalesList().as_view()
                           ),
                       url(r'^locales/(?P<id>[\w]{24})/$',
                           rest.LocalesDetails().as_view()),



                       url(r'^translations/$',
                           rest.TranslationList().as_view()
                           ),
                       url(r'^translations/(?P<id>[\w]{24})/$',
                           rest.TranslationDetails().as_view()),

                       url(r'countries-city/regen/$',
                           rest.RegenerateCacheForCountryCity(
                           ).as_view()),




                       )

urlpatterns += router_djcity.urls
urlpatterns += router_djcountry.urls

"""

url(r'^countries/$',
rest.CountryList().as_view()
),
url(r'^countries/(?P<id>[\w]{24})/$',
rest.CountryDetails.as_view()),

url(r'^city/$',
rest.CityList().as_view()
),
url(r'^city/(?P<id>[\w]{24})/$',
rest.CityDetails().as_view()),
"""
