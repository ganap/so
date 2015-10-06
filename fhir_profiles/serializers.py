from restmongo import serializers
from rest_framework import serializers as rest_serializers
import users
from basic_documents import serializers as basic_serializers


class PatientSerializer(serializers.ModelEmbeddedSerializer):
    name = basic_serializers.HumanNameSerializer(many=True)
    telecom = basic_serializers.ContactPointSerializer(many=True)
    address = basic_serializers.AddressSerializer(many=True)

    class Meta:
        model = users.Patient
        fields = ('pk', 'owner', 'name', 'telecom', 'gender',
                  'birthDate', 'photo', 'address', 'maritalStatus')


class ExpertSerializer(serializers.ModelEmbeddedSerializer):
    name = basic_serializers.HumanNameSerializer()

    class Meta:
        model = users.Expert
        fields = ('pk', 'owner', 'name', 'photo', 'degree', 'speciality',
                  'clinical_expertise', 'link_to_drupal')


class RelatedPersonSerializer(serializers.ModelEmbeddedSerializer):
    name = basic_serializers.HumanNameSerializer(required=False)
    telecom = basic_serializers.ContactPointSerializer(many=True,
                                                       required=False)
    address = basic_serializers.AddressSerializer(required=False)
    period = basic_serializers.PeriodSerializer(required=False,
                                                allow_null=True)

    def create(self, validated_data):
        1 / 0
        return users.RelatedPerson(**validated_data)

    def get_validation_exclusions(self):
        exclusions = super(
            RelatedPersonSerializer, self).get_validation_exclusions()
        return exclusions + ['period']

    class Meta:
        model = users.RelatedPerson
        fields = ('pk', 'owner', 'name', 'telecom', 'gender',
                  'address', 'relationship', 'period')
