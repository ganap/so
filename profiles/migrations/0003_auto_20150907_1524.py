# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0002_mainuser_run_once'),
    ]

    operations = [
        migrations.AddField(
            model_name='mainuser',
            name='is_organization',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='mainuser',
            name='organization',
            field=models.CharField(default=b'', max_length=30),
        ),
        migrations.AddField(
            model_name='mainuser',
            name='profile',
            field=models.CharField(default=b'', max_length=30),
        ),
    ]
