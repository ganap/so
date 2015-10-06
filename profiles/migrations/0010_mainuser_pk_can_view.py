# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import L18n.fields


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0009_mainuser_fhir_doc'),
    ]

    operations = [
        migrations.AddField(
            model_name='mainuser',
            name='pk_can_view',
            field=L18n.fields.ListField(default=[]),
        ),
    ]
