from django.db import models
from mongoengine import fields
from L18n import fields as L18n_fields


class SitePreferences(models.Model):
    last_paypal_transaction_id = L18n_fields.ListField()
    # CEO things
    title = models.CharField(max_length=100, default='Second Opinion')
    keywords = models.CharField(max_length=400, default='', blank=True)
    description = models.CharField(max_length=500, default='', blank=True)
    # shutdown
    use_shutdown = models.BooleanField(default=False)
    shutdown_text = models.CharField(max_length=500, default='', blank=True)
    shutdown_date_start = models.DateTimeField(blank=True, null=True)
    shutdown_date_end = models.DateTimeField(blank=True, null=True)
    shutdown_send_mail_msg = models.BooleanField(default=True)
    shutdown_wall_mail_text = models.CharField(max_length=500,
                                               default='', blank=True)


"""
    MongoDB
"""


class SiteEmails(fields.Document):
    name = fields.StringField()
    subject = fields.StringField()
    html = fields.StringField()
    available_locales = fields.ListField(
        fields.StringField()
    )
    var_list = fields.ListField(
        fields.StringField()
    )
    translation_subject = fields.DictField()
    translation_html = fields.DictField()
