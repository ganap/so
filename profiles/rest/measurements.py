
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


from basic_documents import measurements, serializers
from L18n import tr
import helpers


class Measurements(APIView):

    def get(self, request, *args, **kwargs):
        try:
            m = measurements.Measurements.objects.get(owner=request.user.pk)
        except:
            return Response({})
        data = serializers.MeasurementsSerializer(m)
        return Response(data.data)

    def post(self, request, *args, **kwargs):
        data = dict(request.data)
        m = measurements.Measurements.objects(owner=request.user.pk)
        m.delete()
        m = measurements.Measurements(
            owner=request.user.pk,
            units=data['units'],
            height=data.get('height', None),
            body_mass=data.get('body_mass', None)
        )
        m.save()
        data = serializers.MeasurementsSerializer(m)
        return Response(data.data)


class DailyMeasurements(APIView):

    def post(self, request, *args, **kwargs):
        data = dict(request.data)
        try:
            m = measurements.Measurements.objects.get(owner=request.user.pk)
        except:
            return Response({}, status.HTTP_401_UNAUTHORIZED)
        data['timestamp'] = helpers.date.timestamp()
        day = measurements.EveryDayMeasurements(**data)
        m.everyday_list.append(day)
        m.last_date = helpers.date.timestamp()
        m.save()
        return Response({})

    def put(self, request, *args, **kwargs):
        data = dict(request.data)
        try:
            m = measurements.Measurements.objects.get(owner=request.user.pk)
        except:
            return Response({}, status.HTTP_401_UNAUTHORIZED)
        data['timestamp'] = helpers.date.timestamp()
        day = measurements.EveryDayMeasurements(**data)
        m.everyday_list.remove(
            m.everyday_list[m.everyday_list.count() - 1]
        )  # remove last element
        m.everyday_list.append(day)
        m.save()
        return Response({})
