from rest_framework_mongoengine import serializers
from rest_framework import serializers as rserializers
import models
import helpers
import time


class ModelSerializer(serializers.DocumentSerializer):

    def _include_additional_options(self, *args, **kwargs):
        return self.get_extra_kwargs()

    def _get_default_field_names(self, *args, **kwargs):
        return self.get_field_names(*args, **kwargs)


class DialogPreferencesSerializer(ModelSerializer):

    class Meta:
        model = models.DialogPreferences
        fields = ('owner', 'dialog_with_users')


class DialogMsg(ModelSerializer):

    class Meta:
        model = models.DialogMsg
        fields = ('mail_type', 'text', 'timestamp', 'obj')


class Dialog(ModelSerializer):

    # last_msg_timestamp = rserializers.SerializerMethodField()

    # def get_last_msg_timestamp(self, obj):
        # times 1000 for javascript.
     #   return time.mktime(obj.last_msg_timestamp.timetuple()) * 1000

    class Meta:
        model = models.Dialog
        fields = ('owner', 'dialog_with_user', 'last_msg_timestamp',
                  'unreaded_count')
