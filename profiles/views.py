# -*- coding: utf-8 -*


import django.views.generic as views_generic
from django.shortcuts import redirect
from django.template.loader import render_to_string
from rest_framework.views import APIView
from rest_framework.response import Response

from paypal.standard.forms import PayPalPaymentsForm
from django.conf import settings
from django.core.urlresolvers import reverse

from paypal.standard.ipn.signals import valid_ipn_received
from site_pref import models as sitepref_models
from profiles import models

from django.contrib.auth import logout
import helpers


class TemplateViewSPref(views_generic.TemplateView):

    def __init__(self, *args, **kwargs):
        self.site_pref = sitepref_models.SitePreferences.objects.all()[0]
        super(TemplateViewSPref, self).__init__(*args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(TemplateViewSPref, self).get_context_data(**kwargs)
        context['site_pref'] = self.site_pref
        return context


class BasePage(TemplateViewSPref):
    template_name = 'main_app_base.html'


class ShutdownPage(TemplateViewSPref):
    template_name = "shutdown.html"


class LoginPage(TemplateViewSPref):
    template_name = 'login.html'

    def get_context_data(self, **kwargs):
        context = super(LoginPage, self).get_context_data(**kwargs)
        context['site_pref'] = self.site_pref
        return context

    def dispatch(self, request, *args, **kwargs):
        if self.site_pref.use_shutdown and \
                self.site_pref.shutdown_date_start < helpers.timestamp():
            return redirect('/sh/')
        if request.user.is_authenticated():
            if not request.user.run_once:
                return redirect("/s/")
            return redirect("/ro/")
        return super(LoginPage, self).dispatch(request, *args, **kwargs)


class RegisterPage(TemplateViewSPref):
    template_name = 'registration.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated():
            return redirect("/home.html")
        return super(RegisterPage, self).dispatch(request, *args, **kwargs)


class MainPageAuthenticatedUsed(TemplateViewSPref):
    template_name = 'patient.html'

    def dispatch(self, request, *args, **kwargs):
        is_admin = getattr(request.user, 'is_admin', False)
        is_moderator = getattr(request.user, 'is_moderator', False)
        is_expert = getattr(request.user, 'is_expert', False)
        if is_admin:
            return redirect('/a/')
        if is_moderator:
            return redirect('/m/')
        if is_expert:
            return redirect('/e/')
        if self.site_pref.use_shutdown and \
                self.site_pref.shutdown_date_start < helpers.timestamp():
            return redirect('/sh/')
        return super(MainPageAuthenticatedUsed, self).dispatch(request, *args, **kwargs)


class WebRTCOne2One(TemplateViewSPref):
    template_name = "webrtc_one2one.html"

    def get_context_data(self, **kwargs):
        context = super(WebRTCOne2One, self).get_context_data(**kwargs)
        context['room'] = kwargs.get('room')
        context['username1'] = kwargs.get('username1')
        context['username2'] = kwargs.get('username2')
        return context

    def dispatch(self, request, *args, **kwargs):
        if self.site_pref.use_shutdown and \
                self.site_pref.shutdown_date_start < helpers.timestamp():
            return redirect('/sh/')
        if not request.user.is_authenticated():
            return redirect("/")
        return super(WebRTCOne2One, self).dispatch(request, *args, **kwargs)


class ResetPassword(TemplateViewSPref):
    template_name = 'reset_password.html'

    def get_context_data(self, **kwargs):
        context = super(ResetPassword, self).get_context_data(**kwargs)
        context['user'] = self.request.user
        return context

    def dispatch(self, request, *args, **kwargs):
        reset_url = kwargs.get('reset_url')
        self.reset = models.ResetPasswordUrl.objects.filter(url=reset_url)
        if not self.reset:
            return redirect('/')
        if request.user.is_authenticated():
            return redirect("/s/")
        return super(ResetPassword, self).dispatch(request, *args, **kwargs)


class MainPageRunOnce(TemplateViewSPref):
    template_name = 'run_once.html'

    def dispatch(self, request, *args, **kwargs):
        if self.site_pref.use_shutdown and \
                self.site_pref.shutdown_date_start < helpers.timestamp():
            return redirect('/sh/')
        run_once = getattr(request.user, 'run_once', False)
        if request.user.is_authenticated() and not run_once:
            return redirect("/s/")
        return super(MainPageRunOnce, self).dispatch(request, *args, **kwargs)


class AdminPage(TemplateViewSPref):
    template_name = 'admin.html'

    def dispatch(self, request, *args, **kwargs):
        is_admin = getattr(request.user, 'is_admin', False)
        if not is_admin:
            return redirect("/")
        return super(AdminPage, self).dispatch(request, *args, **kwargs)


class ModeratorPage(TemplateViewSPref):
    template_name = 'moderator.html'

    def dispatch(self, request, *args, **kwargs):
        if self.site_pref.use_shutdown:
            return redirect('/sh/')
        is_moderator = getattr(request.user, 'is_moderator', False)
        is_admin = getattr(request.user, 'is_admin', False)

        if not is_admin and not is_moderator:
            return redirect("/")
        return super(ModeratorPage, self).dispatch(request, *args, **kwargs)


class ExpertPage(TemplateViewSPref):
    template_name = 'expert.html'

    def dispatch(self, request, *args, **kwargs):
        if self.site_pref.use_shutdown:
            return redirect('/sh/')
        is_expert = getattr(request.user, 'is_expert', False)

        if not is_expert:
            return redirect("/")
        return super(ExpertPage, self).dispatch(request, *args, **kwargs)


class HomePage(TemplateViewSPref):
    template_name = "static_pages/index.html"


class LibraryPage(TemplateViewSPref):
    template_name = "static_pages/library.html"


class AboutPage(TemplateViewSPref):
    template_name = "static_pages/about.html"


class TeamPage(TemplateViewSPref):
    template_name = "static_pages/team.html"


class ContactPage(TemplateViewSPref):
    template_name = "static_pages/contact.html"


class AboutSoUnregisteredPage(TemplateViewSPref):
    template_name = "static_pages/about_so_unregistered.html"

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated():
            if not request.user.is_admin and not request.user.is_moderator and not request.user.is_expert:
                return redirect('/s/#/patient/so')
        return super(AboutSoUnregisteredPage, self).dispatch(request, *args, **kwargs)


class Logout(TemplateViewSPref):
    template_name = "static_pages/index.html"

    def dispatch(self, request, *args, **kwargs):
        try:
            logout(request)
        except:
            pass
        return redirect("/")


"""

class RenderPaypalButtonPremiumPromoCode(APIView):

    def get(self, request, *args, **kwargs):

        paypal_dict = {
            "business": settings.PAYPAL_RECEIVER_EMAIL,
            # amount - цена
            "amount": "#PRICE#",
            # item_name - название услуги (напр. кофейная чашка).
            "item_name": "Promo code",
            # invoice - уникальный номер счета фактуры.
            "invoice": "#INVOICE#",
            # notify_url - url по которому приходят все события (об оплате)
            "notify_url": settings.THIS_SERVER + reverse('paypal-ipn'),
            "return_url": settings.THIS_SERVER + reverse('paypal-on-return'),
            "cancel_return": settings.THIS_SERVER + reverse('paypal-on-cancel'),
        }

        form = PayPalPaymentsForm(initial=paypal_dict)
        context = {"form": form}
        html = render_to_string("payment.html", context)
        # html = html.replace("#PRICE#", "{{promocode.price}}")
        # html = html.replace("#INVOICE#", "{{promocode.invoice}}")

        sp = models.SitePreferences.objects.all()[0]
        prices = {
            '1m': sp.premium_price_1m,
            '3m': sp.premium_price_3m,
            '6m': sp.premium_price_6m,
            '12m': sp.premium_price_12m
        }

        return Response({
            'button_html': html,
            'prices': prices
        })


def on_paypal_ipn_receive(sender, **kwargs):
    ipn_obj = sender

    f = open(settings.BASE_DIR + "/sp", "w")
   # if ipn_obj.payment_status == ST_PP_COMPLETED:
    if 1 == 0:
        verified = helpers.paypal_ipn.verify_ipn(ipn_obj)
        f.write(repr(verified))
        f.close()
        if not verified[0]:
            if verified[1] == None:
                return
            info = verified[2]
            user = mongoapp_models.User.objects(owner_pk=info['user_pk'])
            if not user:
                return
            user = user[0]
            # if "failed to verify" in verified[1]:
            return
        info = verified[1]
        sp = models.SitePreferences.objects.all()[0]
        sp.last_paypal_transaction_id.append(info['transaction_id'])
        if len(sp.last_paypal_transaction_id) > 120:
            sp.last_paypal_transaction_id = sp.last_paypal_transaction_id[
                -100:]
            sp.save()

    if 1 == 1:
        info = {
            "period": '3m',
            "user_pk": '1',
            "transaction_id": "21221"
        }
        # создаем автоматический промокод для пользователя:
        PERIOD = {
            '1m': 30,
            '3m': 30 * 3,
            '6m': 30 * 6,
            '12m': 365
        }
        # количество дней для промокода.
        value_add_days = PERIOD[info['period']]
        promocode = mongoapp_models.model_promocode.PromoCodeAutogen(
            for_user=int(info["user_pk"]),
            date_created=helpers.timestamp(),
            code=helpers.id_generator(size=6, use_digits=False),
            value_add_days=value_add_days,
            transaction_id=info['transaction_id']
        )
        promocode.save()
        # отправляем уведомление на стену:
        text_msg = "Your payment was successful. You can apply the Promo code " \
            +  promocode.code + \
            " at any convenient time during the year. Go to Promotional Code page to insert a code."
        helpers.tornado_ws.sendMsg(int(info['user_pk']),
                                   text_msg
                                   )


valid_ipn_received.connect(on_paypal_ipn_receive)
"""
