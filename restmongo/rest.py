from rest_framework import mixins
from rest_framework_mongoengine import generics
from rest_framework import status
from rest_framework.response import Response
from helpers import fs
from datetime import datetime


class ListCreateAPIView(mixins.ListModelMixin,
                        mixins.CreateModelMixin,
                        generics.GenericAPIView):

    """
        Concrete view for listing a queryset or creating a model instance.
        Add owner_pk field to model instance
    """

    def perform_create(self, serializer):
        serializer.save(owner_pk=self.request.user.pk)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class ListCreateWithFilesAPIView(mixins.ListModelMixin,
                                 mixins.CreateModelMixin,
                                 generics.GenericAPIView):
    file_fields = []
    autodate_on_create_fields = ['date_created']
    func_for_saving_files = [fs.save_file_at_spesial_path, ]
    autodate_on_create_fields = []

    """
        Add owner_pk field to model instance.
        Handle files in json post.
    """

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        """
            get all fields in file_fields and save as a files
        """
        data = request.data
        special_data = {}
        for field in self.file_fields:
            if field in data.keys():
                f = data[field]
                path = self.func_for_saving_files[0](f.name, f)
                special_data[field] = path

        """
            autodate fields
        """
        for field in self.autodate_on_create_fields:
            special_data[field] = datetime.now()

        self.perform_create(serializer, **special_data)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, **kwargs):
        serializer.save(owner_pk=self.request.user.pk, **kwargs)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
