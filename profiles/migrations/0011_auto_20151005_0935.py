# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import L18n.fields


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0010_mainuser_pk_can_view'),
    ]

    operations = [
        migrations.AddField(
            model_name='mainuser',
            name='paypal_transaction_id_new',
            field=L18n.fields.ListField(default=[]),
        ),
        migrations.AddField(
            model_name='mainuser',
            name='paypal_transaction_id_old',
            field=L18n.fields.ListField(default=[]),
        ),
    ]
