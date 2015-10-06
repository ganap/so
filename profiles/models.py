from django.db import models
from django.contrib.auth.models import AbstractUser
from L18n import fields

# main model in MySql or in sqlite


class MainUser(AbstractUser):

    is_admin = models.BooleanField(default=False)
    is_moderator = models.BooleanField(default=False)
    is_expert = models.BooleanField(default=False)
#
    is_organization = models.BooleanField(default=False)
    patient = models.CharField(max_length=30, default='')
    organization = models.CharField(max_length=30, default='')
    expert = models.CharField(max_length=30, default='')
    run_once = models.BooleanField(default=False)
    socket_user_oid = models.CharField(max_length=30, default='')
    created_by = models.IntegerField(default=0)
    pk_can_edit = fields.ListField(default=[])
    pk_can_view = fields.ListField(default=[])
    fhir_doc = models.CharField(max_length=30, default='')
    paypal_transaction_id_new = fields.ListField(default=[])
    paypal_transaction_id_old = fields.ListField(default=[])


class ResetPasswordUrl(models.Model):
    url = models.CharField(max_length=20, unique=True)
    user_pk = models.IntegerField(default=0)
