
from rest_framework import serializers
from site_pref import models


class SitePreferencesSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = models.SitePreferences
        fields = ('title', 'keywords', 'keywords', 'description',
                  )
