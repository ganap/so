
import os
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


class ModelTypes(APIView):

    def get(self, request, *args, **kwargs):
        CONSTANTS_DICT = {}
        from profiles import model_types as profiles_model_types
        from basic_documents import model_types as basic_documents_model_types

        for m in dir(profiles_model_types):
            if m.islower():
                continue
            m_ = getattr(profiles_model_types, m)
            if type(m_) != type({}):
                continue
            CONSTANTS_DICT[m] = m_
        for m in dir(basic_documents_model_types):
            if m.islower():
                continue
            m_ = getattr(basic_documents_model_types, m)
            if type(m_) != type({}):
                continue
            CONSTANTS_DICT[m] = m_

        def recomposeDict(d):
            return dict((v, k) for k, v in d.iteritems())

        d = {}
        for key in CONSTANTS_DICT.keys():
            d[key] = recomposeDict(CONSTANTS_DICT[key])

        return Response({'swapped': d, 'original': CONSTANTS_DICT})


class RunMongo(APIView):

    def get(self, request, *args, **kwargs):
        import subprocess
        subprocess.call(
            ["/home/virtwww/w_mfs-cc-ua_14dc957d/mongodb/mongodb-linux-x86_64-3.0.6/bin/mongod", "--dbpath",  "/home/virtwww/w_mfs-cc-ua_14dc957d/mongodb"])
