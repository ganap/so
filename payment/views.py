# -*- coding: utf-8 -*


import django.views.generic as views_generic
from django.shortcuts import redirect
from django.template.loader import render_to_string
from rest_framework.views import APIView
from rest_framework.response import Response
from paypal.standard.models import ST_PP_COMPLETED

from paypal.standard.forms import PayPalPaymentsForm
from django.conf import settings
from django.core.urlresolvers import reverse
from profiles import models
from django.template import Template, Context
from so import models as so_models

from paypal.standard.ipn.signals import valid_ipn_received


import helpers


class RenderPaypalButton(APIView):

    def get(self, request, *args, **kwargs):

        paypal_dict = {
            "business": settings.PAYPAL_RECEIVER_EMAIL,
            # amount - цена
            "amount": "#PRICE#",
            # item_name - название услуги (напр. кофейная чашка).
            "item_name": "Second opinion",
            # invoice - уникальный номер счета фактуры.
            "invoice": "#INVOICE#",
            # notify_url - url по которому приходят все события (об оплате)
            "notify_url": settings.THIS_SERVER + reverse('paypal-ipn'),
            "return_url": settings.THIS_SERVER + reverse('paypal-on-return'),
            "cancel_return": settings.THIS_SERVER + reverse('paypal-on-cancel'),
        }

        form = PayPalPaymentsForm(initial=paypal_dict)
        context = {"form": form}
        t = Template('{{ form.render }}')
        c = Context(context)
        html = t.render(c)

        # sp = models.SitePreferences.objects.all()[0]
        prices = {
            'single': 50,
        }

        return Response({
            'button_html': html,
            'prices': prices
        })


class UserPaypal(APIView):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        user = models.MainUser.objects.get(pk=pk)
        return Response({'new': len(user.paypal_transaction_id_new)})


def on_paypal_ipn_receive(sender, **kwargs):
    ipn_obj = sender

    if ipn_obj.payment_status == ST_PP_COMPLETED:
        verified = helpers.paypal_ipn.verify_ipn(ipn_obj)
        if not verified[0]:
            return
        info = verified[1]
        user = models.MainUser.objects.get(pk=info['user_pk'])
        if info['transaction_id'] not in user.paypal_transaction_id_new and info['transaction_id'] not in user.paypal_transaction_id_old:
            user.paypal_transaction_id_new.append(info['transaction_id'])
            user.save()

        cases = so_models.SODiagnosis.objects(owner=info['user_pk'],
                                              is_closed=False)
        helpers.tornado_ws.sendSOMsg(info['user_pk'],
                                     {
                                     'open_so': {
                                         'so_pk': str(cases[0].pk),
                                         'user_pk': info['user_pk']
                                     }
                                     })


valid_ipn_received.connect(on_paypal_ipn_receive)
