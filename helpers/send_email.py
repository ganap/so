from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context, Template
from django.conf import settings
from site_pref import models


class SendMailDB:

    def __init__(self, to_email, context, template_name, locale=None):
        self.context = context
        site_pref = models.SitePreferences.objects.all()[0]
        self.context['site_pref'] = site_pref
        self.context['SITE_URL'] = settings.SITE_URL
        self.to_email = to_email
        self.template_name = template_name
        self.locale = locale

    def renderTemplate(self, template_string):
        template = Template(template_string)
        c = Context(self.context)
        return template.render(c)

    def getTemplate(self, name):
        obj = models.SiteEmails.objects.get(name=name)
        if self.locale in obj.available_locales:
            return (obj.translation_html[self.locale],
                    obj.translation_subject[self.locale])
        return (obj.html, obj.subject)

    def send(self):
        template_str = self.getTemplate(self.template_name)
        subject = self.renderTemplate(template_str[1])
        html_content = self.renderTemplate(template_str[0])
        msg = EmailMultiAlternatives(subject.replace("\n", ""), html_content,
                                     settings.DEFAULT_FROM_EMAIL, [self.to_email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
