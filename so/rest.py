from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from profiles import models as profiles_models
import models
import serializers
import helpers


class SODiagnosis(APIView):

    def post(self, request, *args, **kwargs):
        data = dict(request.data)
        so_list = models.SODiagnosis.objects(owner=request.user.pk,
                                             is_closed=False)
        if so_list:
            for s in so_list:
                user_pk = s.owner
                helpers.tornado_ws.sendSOMsg(user_pk,
                                             {
                                             'remove_opened_in_progress':
                                             {
                                                 'user_pk': user_pk,
                                                 'so_pk': str(s.pk)
                                             }
                                             })
        so_list.delete()
        so = models.SODiagnosis(owner=request.user.pk,
                                request_info=data)
        so.save()
        return Response({'pk': str(so.pk)})


class SODiagnosisOwn(APIView):

    def get(self, request, *args, **kwargs):
        data = dict(request.data)
        so = models.SODiagnosis.objects(owner=request.user.pk,
                                        is_closed=False,
                                        is_closed_by_user=False)
        so_closed = models.SODiagnosis.objects(owner=request.user.pk,
                                               is_closed=True,
                                               is_closed_by_user=True)
        so_processed = models.SODiagnosis.objects(owner=request.user.pk,
                                                  is_closed=True,
                                                  is_closed_by_user=False)

        data_closed = serializers.SODiagnosisSerializer(so_closed, many=True)
        data_processed = serializers.SODiagnosisSerializer(so_processed,
                                                           many=True)
        data = serializers.SODiagnosisSerializer(so, many=True)
        cases = {
            'in_progress': data.data,
            'processed': data_processed.data,
            'closed': data_closed.data
        }
        return Response(cases)


class SODiagnosisDetails(APIView):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('id')
        so = models.SODiagnosis.objects.get(pk=pk)
        if request.user.is_expert or request.user.is_moderator or request.user.is_admin:
            data = serializers.SODiagnosisSerializer(so)
            return Response(data.data)

        if so.owner != request.user.pk:
            return Response({})
        data = serializers.SODiagnosisSerializer(so)
        return Response(data.data)

    def put(self, request, *args, **kwargs):
        """
            Put here email to user
        """
        data = dict(request.data)
        pk = kwargs.get('id')
        so = models.SODiagnosis.objects.get(pk=pk)
        if so.is_closed or not request.user.is_expert:
            return Response({}, status.HTTP_403_FORBIDDEN)
        so.from_expert = request.user.pk
        so.summary = data.get('summary', '')
        so.diagnosis = data.get('diagnosis', '')
        so.second_opinion = data.get('second_opinion', '')
        so.request_info = data.get('request_info', {})
        so.is_closed = True
        so.save()
        data = serializers.SODiagnosisSerializer(so)
        return Response(data.data)

    def delete(self, request, *args, **kwargs):
        """
            Marks so as closed by user
        """
        pk = kwargs.get("id")
        so = models.SODiagnosis.objects.get(pk=pk)
        if so.owner == request.user.pk and so.is_closed:
            so.is_closed_by_user = True
            so.save()
            helpers.tornado_ws.sendSOMsg(request.user.pk,
                                         {
                                         'close_so':
                                         {
                                             'user_pk': request.user.pk,
                                             'so_pk': str(so.pk)
                                         }
                                         })
        return Response({})
