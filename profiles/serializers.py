from rest_framework import serializers
from profiles import models
from fhir_profiles import users, serializers as fhir_serializers
from basic_documents import info, serializers as basic_serializers


class MainUserSerializer(serializers.HyperlinkedModelSerializer):
    patient = serializers.SerializerMethodField()
    expert = serializers.SerializerMethodField()
    organization = serializers.SerializerMethodField()
    pk_can_edit = serializers.SerializerMethodField()
    paypal_transaction_id_new = serializers.SerializerMethodField()
    paypal_transaction_id_old = serializers.SerializerMethodField()
    fhir_doc = serializers.SerializerMethodField()

    def get_paypal_transaction_id_old(self, obj):
        return obj.paypal_transaction_id_old

    def get_paypal_transaction_id_new(self, obj):
        return obj.paypal_transaction_id_new

    def get_pk_can_edit(self, obj):
        return obj.pk_can_edit

    def get_organization(self, obj):
        return ''

    def get_expert(self, obj):
        if obj.expert == '':
            return ''
        expert = users.Expert.objects.get(pk=obj.expert)
        data = fhir_serializers.ExpertSerializer(expert)
        return data.data

    def get_patient(self, obj):
        if obj.patient == '':
            return ''
        patient = users.Patient.objects.get(pk=obj.patient)
        data = fhir_serializers.PatientSerializer(patient)
        return data.data

    def get_fhir_doc(self, obj):
        if obj.fhir_doc == '':
            fhir_doc = info.FhirDoc()
            fhir_doc.save()
            obj.fhir_doc = str(fhir_doc.pk)
            obj.save()
        else:
            fhir_doc = info.FhirDoc.objects.get(pk=obj.fhir_doc)
        data = basic_serializers.FhirDocSerializer(fhir_doc)
        return data.data

    class Meta:
        model = models.MainUser
        fields = (
            'pk', 'patient', 'organization', 'username', 'socket_user_oid', 'is_expert',
                  'is_organization', 'run_once', 'email', 'expert', 'is_moderator', 'is_admin',
            'pk_can_edit', 'created_by', 'fhir_doc', 'paypal_transaction_id_new',
            'paypal_transaction_id_old')
