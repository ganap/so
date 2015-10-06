from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from profiles import models, serializers
from rest_framework_mongoengine.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from permissions import permissions
from helpers import users
from fhir_profiles import users as fhir_users, serializers as fhir_serializers
from basic_documents import creator


class ExpertsList(APIView):

    def get(self, request, *args, **kwargs):
        experts = models.MainUser.objects.filter(
            is_expert=True
        )
        data = serializers.MainUserSerializer(experts, many=True)
        return Response(data.data)

    def post(self, request, *args, **kwargs):
        is_admin = getattr(request.user, 'is_admin', None)
        if not is_admin:
            return Response({}, status.HTTP_403_FORBIDDEN)
        data = dict(request.data)
        send_mail = not data['send_email']
        expert = users.CreateUser(data['username'],
                                  data['email'],
                                  password=data['password'],
                                  unittest=send_mail,
                                  is_expert=True)

        expert_mongo = fhir_users.Expert(
            owner=expert.pk,
            name=creator.HumanName(data['expert']['name']),
            degree=data['expert']['degree'],
            speciality=data['expert']['speciality'],
            clinical_expertise=data['expert']['clinical_expertise'],
            link_to_drupal=data['expert']['link_to_drupal']
        )
        expert_mongo.save()
        expert.is_expert = True
        expert.expert = str(expert_mongo.pk)
        expert.save()
        data = serializers.MainUserSerializer(expert)
        return Response(data.data, status.HTTP_201_CREATED)


class ExpertDetails(RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.MainUserSerializer
    queryset = models.MainUser
    permission_classes = (permissions.IsAdminOrReadOnly,)

    def perform_update(self, serializer):
        serializer.save()
        instance = self.get_object()
        expert = fhir_users.Expert.objects.get(pk=instance.expert)
        for field in self.request.data['expert'].keys():
            value = self.request.data['expert'][field]
            if type(value) == type({}):
                setattr(expert, field, creator.HumanName(value))
            else:
                setattr(expert, field, value)
        expert.save()
