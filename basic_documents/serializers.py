from restmongo import serializers
from rest_framework_mongoengine import serializers as mongo_serializers
import info
import users
import measurements

from rest_framework import serializers as rserializers


class PeriodSerializer(serializers.ModelEmbeddedSerializer):
    start = rserializers.DateTimeField(required=False)
    end = rserializers.DateTimeField(required=False)

    class Meta:
        model = info.Period
        fields = ('start', 'end')


class ContactPointSerializer(serializers.ModelEmbeddedSerializer):
    period = PeriodSerializer(required=False, allow_null=True)

    class Meta:
        model = info.ContactPoint
        fields = ('system', 'value', 'use', 'period')


class HumanNameSerializer(serializers.ModelEmbeddedSerializer):
    period = PeriodSerializer(required=False, allow_null=True)

    class Meta:
        model = users.HumanName
        fields = ('use', 'family', 'given',
                  'prefix', 'suffix', 'period')


class AddressSerializer(serializers.ModelEmbeddedSerializer):
    period = PeriodSerializer(required=False, allow_null=True)

    class Meta:
        model = info.Address
        fields = ('use', 'type_', 'line', 'city',
                  'state', 'country', 'postalCode',
                  'period')


class AttachmentSerializer(serializers.ModelSerializer):
    gcloud_path = serializers.DictField(read_only=True)
    timestamp = rserializers.DateTimeField(read_only=True)
    owner = rserializers.IntegerField(read_only=True)

    class Meta:
        model = info.Attachment
        fields = ('pk', 'owner', 'ext', 'gcloud_path', 'title', 'creation',
                  'timestamp')


class EveryDayMeasurementsSerializer(serializers.ModelEmbeddedSerializer):

    class Meta:
        model = measurements.EveryDayMeasurements
        fields = ('heart_rate', 'body_temperature', 'basal_body_temperature',
                                'blood_pressure_systolic', 'blood_pressure_diastolic',
                                'respiratory_rate', 'body_mass',

                  #
                                'gwb_anxiety', 'gwb_concentration', 'gwb_stress', 'gwb_energy',
                                'ss_fatigue', 'ss_mouth_sores', 'ss_hair_loss', 'ss_nausea',
                                'ss_diarrhea', 'ss_sensory_problems', 'ss_general_pain',
                                'ss_fever', 'timestamp', 'i_took_today', 'journal_entry')


class MeasurementsSerializer(serializers.ModelSerializer):
    everyday_list = EveryDayMeasurementsSerializer(many=True)

    class Meta:
        model = measurements.Measurements
        fields = ('pk', 'units', 'height', 'body_mass', 'everyday_list',
                  'last_date')


class FhirDocSerializer(serializers.ModelSerializer):

    class Meta:
        model = info.FhirDoc
        fields = ('Condition', 'Observations', 'MedicationPrescription',
                  'MedicationDispence', 'Procedure', 'Immunization',
                  'FamilyHistory', 'AllergyIntolerance',
                  'ImagingStudy', 'CarePlan', 'Treatment')
