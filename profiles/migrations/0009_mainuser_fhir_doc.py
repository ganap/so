# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0008_mainuser_pk_can_edit'),
    ]

    operations = [
        migrations.AddField(
            model_name='mainuser',
            name='fhir_doc',
            field=models.CharField(default=b'', max_length=30),
        ),
    ]
