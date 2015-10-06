# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0004_auto_20150909_1504'),
    ]

    operations = [
        migrations.AddField(
            model_name='mainuser',
            name='expert',
            field=models.CharField(default=b'', max_length=30),
        ),
        migrations.AddField(
            model_name='mainuser',
            name='is_expert',
            field=models.BooleanField(default=False),
        ),
    ]
