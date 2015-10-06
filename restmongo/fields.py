from rest_framework_mongoengine.fields import DocumentField
from rest_framework import serializers


class PointField(serializers.Field):

    type_label = 'PointField'

    def __init__(self, *args, **kwargs):
        self.model_field = {}

    def to_internal_value(self, data):
        return self.model_field.to_python(data)

    def to_representation(self, value):
        return self.transform_object(value, self.depth)
