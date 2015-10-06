from restmongo import serializers
import models


class SODiagnosisSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.SODiagnosis
        fields = ('owner', 'from_expert', 'summary', 'second_opinion',
                  'so_obj',  'is_closed', 'request_info', 'diagnosis',
                  'is_closed_by_user', 'pk')
